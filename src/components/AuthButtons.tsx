"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogIn, UserPlus } from "lucide-react";

export const AuthButtons: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/register");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={handleLogin}
        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        size="sm"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Login
      </Button>
      <Button
        onClick={handleSignup}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Sign Up
      </Button>
    </div>
  );
};
