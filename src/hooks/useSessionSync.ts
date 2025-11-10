/**
 * Session Sync Hook
 *
 * Syncs NextAuth OAuth session with Redux store.
 * Call this hook in your root layout or app component.
 *
 * When user logs in with Google/GitHub:
 * 1. NextAuth stores session
 * 2. This hook reads session
 * 3. Extracts YOUR backend token
 * 4. Stores in Redux (same as regular login)
 * 5. All API calls use YOUR token automatically
 */

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout } from "@/store/features/authSlice";

export function useSessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.backendToken &&
      !isAuthenticated
    ) {
      // Sync NextAuth session to Redux
      dispatch(
        setCredentials({
          user: session.user,
          token: session.backendToken,
        })
      );
    } else if (status === "unauthenticated" && isAuthenticated) {
      // Clear Redux if NextAuth session is gone
      dispatch(logout());
    }
  }, [session, status, dispatch, isAuthenticated]);

  return { session, status };
}
