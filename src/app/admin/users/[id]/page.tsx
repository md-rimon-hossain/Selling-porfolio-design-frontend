"use client";

import { use } from "react";
import { useGetUserQuery } from "@/services/api";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data, isLoading, error } = useGetUserQuery(id);
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Failed to load user</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/admin" className="hover:text-blue-600 transition-colors">
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/users"
            className="hover:text-blue-600 transition-colors"
          >
            Users
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">User Details</span>
        </div>

        {/* Back Button */}
        <Link href="/admin/users">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>
        </Link>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600"></div>

          <div className="px-8 pb-8">
            {/* Profile Image and Basic Info */}
            <div className="flex items-start gap-6 -mt-16 mb-6">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}

              <div className="flex-1 mt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                      {user.name}
                    </h1>
                    <p className="text-slate-600 mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-300">
                      <XCircle className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User ID */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-600 mb-1 font-medium">
                  User ID
                </div>
                <div className="text-lg font-mono text-slate-900">
                  {user._id}
                </div>
              </div>

              {/* Role */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-600 mb-1 font-medium">
                  Role
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {user.role === "admin" ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-purple-600" />
                      <span className="text-lg font-semibold text-purple-900">
                        Administrator
                      </span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-semibold text-blue-900">
                        Customer
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Account Created */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-600 mb-1 font-medium">
                  Account Created
                </div>
                <div className="flex items-center gap-2 text-slate-900 mt-2">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <span className="text-base">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-600 mb-1 font-medium">
                  Last Updated
                </div>
                <div className="flex items-center gap-2 text-slate-900 mt-2">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <span className="text-base">
                    {formatDate(user.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Account Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.isActive ? "bg-green-500" : "bg-red-500"
                    } ${user.isActive ? "animate-pulse" : ""}`}
                  />
                  <span className="text-sm text-slate-700">
                    Account is{" "}
                    <span className="font-semibold">
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.isDeleted ? "bg-red-500" : "bg-green-500"
                    }`}
                  />
                  <span className="text-sm text-slate-700">
                    Account is{" "}
                    <span className="font-semibold">
                      {user.isDeleted ? "Deleted" : "Not Deleted"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Admin Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
              Edit User
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all shadow-lg hover:shadow-xl">
              {user.isActive ? "Deactivate Account" : "Activate Account"}
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl">
              Delete User
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Note: Admin actions are not implemented yet. This is a UI preview.
          </p>
        </div>
      </div>
    </div>
  );
}
