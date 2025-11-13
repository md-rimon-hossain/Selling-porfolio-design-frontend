"use client";

import React, { useEffect, useState } from "react";
import { useGetProfileQuery } from "../services/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCredentials, logout } from "../store/features/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { store } from "../store/store";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const [authChecked, setAuthChecked] = useState(false);

  const { data, error, isLoading, isSuccess, isError } =
    useGetProfileQuery(undefined);

  console.log("AuthWrapper - Query state:", {
    hasData: !!data,
    hasError: !!error,
    isLoading,
    isSuccess,
    isError,
    error: error,
    fullData: data, // Log the full data object
  });

  useEffect(() => {
    if (data && data.data) {
      console.log("AuthWrapper - Profile data received:", data.data);
      console.log("AuthWrapper - Setting credentials in Redux");
      dispatch(
        setCredentials({
          user: data.data,
        })
      );
      setAuthChecked(true);
      console.log("AuthWrapper - Credentials set, checking Redux state...");

      // Verify it was set
      setTimeout(() => {
        console.log(
          "AuthWrapper - Redux state after set:",
          store.getState().auth.user
        );
      }, 100);
    } else if (error) {
      console.log("AuthWrapper - Profile error:", error);
      // Only logout if there's already a user (meaning the session expired)
      // Don't logout on initial load if there's no user yet
      if (user) {
        const errorData = error as { status?: number };
        if (errorData?.status === 401 || errorData?.status === 403) {
          console.log("AuthWrapper - Session expired, logging out");
          dispatch(logout());
        }
      } else {
        console.log("AuthWrapper - No user in state, skipping logout");
      }
      setAuthChecked(true);
    }
  }, [data, error, dispatch, user]);

  // Mark auth as checked when query completes (success or error)
  useEffect(() => {
    if (isSuccess || isError) {
      setAuthChecked(true);
    }
  }, [isSuccess, isError]);

  // Redirect logic ONLY in AuthWrapper
  useEffect(() => {
    // Skip auth check on public pages
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/" ||
      pathname.startsWith("/designs") ||
      pathname === "/pricing" ||
      pathname === "/about" ||
      pathname === "/contact"
    ) {
      setAuthChecked(true);
      return;
    }

    // Wait for auth check to complete
    if (!authChecked) {
      return;
    }

    // Protected routes: /dashboard and /admin
    const isProtectedRoute =
      pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

    if (isProtectedRoute && !user) {
      // No user on protected route -> redirect to login
      router.push("/login");
    } else if (pathname.startsWith("/admin") && user && user.role !== "admin") {
      // Non-admin trying to access admin panel -> redirect to home
      router.push("/");
    }
  }, [pathname, user, authChecked, router]);

  // Redirect logged-in users away from auth pages
  useEffect(() => {
    if (user && (pathname === "/login" || pathname === "/register")) {
      router.push("/");
    }
  }, [user, pathname, router]);

  // Show loading state while fetching profile (but not on login/register pages)
  if (isLoading && pathname !== "/login" && pathname !== "/register") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
