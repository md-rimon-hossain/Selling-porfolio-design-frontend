"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const AuthButtons: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/register");
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        onClick={handleLogin}
        className="text-gray-700 hover:text-gray-900"
      >
        Login
      </Button>
      <Button
        variant="default"
        onClick={handleSignup}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Sign Up
      </Button>
    </div>
  );
};
