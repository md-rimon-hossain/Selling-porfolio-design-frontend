"use client";

import React from "react";
import { useGetProfileQuery } from "../services/api";
import { useAppDispatch } from "../store/hooks";
import { setCredentials, logout } from "../store/features/authSlice";
import { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useGetProfileQuery();

 console.log(data, error);

  useEffect(() => {
    if (data && data.data) {
      dispatch(
        setCredentials({
          user: data.data 
        })
      );
    } else if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  // Show loading state while fetching profile
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
