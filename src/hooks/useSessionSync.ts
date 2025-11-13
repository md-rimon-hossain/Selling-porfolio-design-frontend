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

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout } from "@/store/features/authSlice";

export function useSessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const syncedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("🔍 useSessionSync - Status:", status);
    console.log("🔍 useSessionSync - Has session:", !!session);
    console.log(
      "🔍 useSessionSync - Has backendToken:",
      !!session?.backendToken
    );
    console.log("🔍 useSessionSync - Redux user:", reduxUser?.email || "none");

    // Create a unique session identifier
    const sessionId = session?.backendToken || null;

    if (status === "authenticated" && session?.backendToken) {
      // Only sync if we haven't synced this session yet
      if (syncedSessionRef.current !== sessionId) {
        console.log("✅ Syncing OAuth session to Redux", {
          email: session.user?.email,
          hasToken: !!session.backendToken,
        });
        dispatch(
          setCredentials({
            user: session.user,
            token: session.backendToken,
          })
        );
        syncedSessionRef.current = sessionId;
      } else {
        console.log("⏭️ Session already synced, skipping");
      }
    } else if (status === "unauthenticated" && reduxUser) {
      // Clear Redux if NextAuth session is gone but Redux still has user
      console.log("🧹 Clearing Redux session");
      dispatch(logout());
      syncedSessionRef.current = null;
    }
  }, [session, status, dispatch, reduxUser]);

  return { session, status };
}
