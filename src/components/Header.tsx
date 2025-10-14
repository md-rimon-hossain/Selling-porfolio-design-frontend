"use client";

import React from "react";
import { useAppSelector } from "../store/hooks";
import { UserProfile } from "./UserProfile";
import { AuthButtons } from "./AuthButtons";

export const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  console.log(user);

  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Design Portfolio
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Designs
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Contact
            </a>
          </nav>

          {/* User Profile or Auth Buttons */}
          <div className="flex items-center">
            {user ? <UserProfile user={user} /> : <AuthButtons />}
          </div>
        </div>
      </div>
    </header>
  );
};
