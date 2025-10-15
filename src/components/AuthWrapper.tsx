"use client";

import React, { useEffect, useState } from "react";
import { useGetProfileQuery } from "../services/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCredentials, logout } from "../store/features/authSlice";
import { usePathname, useRouter } from "next/navigation";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const [authChecked, setAuthChecked] = useState(false);
  
  const { data, error, isLoading, isSuccess, isError } = useGetProfileQuery(undefined, {
    // Skip if on login/register pages
    skip: pathname === "/login" || pathname === "/register",
  });

  useEffect(() => {
    if (data && data.data) {
      dispatch(
        setCredentials({
          user: data.data,
        })
      );
      setAuthChecked(true);
    } else if (error) {
      // Only logout if the error is authentication related
      const errorData = error as { status?: number };
      if (errorData?.status === 401 || errorData?.status === 403) {
        dispatch(logout());
      }
      setAuthChecked(true);
    }
  }, [data, error, dispatch]);

  // Mark auth as checked when query completes (success or error)
  useEffect(() => {
    if (isSuccess || isError) {
      setAuthChecked(true);
    }
  }, [isSuccess, isError]);

  // Redirect logic ONLY in AuthWrapper
  useEffect(() => {
    // Skip auth check on public pages
    if (pathname === "/login" || pathname === "/register" || pathname === "/" || pathname.startsWith("/designs") || pathname === "/pricing" || pathname === "/about" || pathname === "/contact") {
      setAuthChecked(true);
      return;
    }

    // Wait for auth check to complete
    if (!authChecked) {
      return;
    }

    // Protected routes: /dashboard and /admin
    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
    
    if (isProtectedRoute && !user) {
      // No user on protected route -> redirect to login
      router.push("/login");
    } else if (pathname.startsWith("/admin") && user && user.role !== "admin") {
      // Non-admin trying to access admin panel -> redirect to home
      router.push("/");
    }
  }, [pathname, user, authChecked, router]);

  // Show loading state while fetching profile (but not on login/register pages)
  if (isLoading && pathname !== "/login" && pathname !== "/register") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
