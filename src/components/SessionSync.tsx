/**
 * Session Sync Component
 *
 * Syncs NextAuth OAuth session with Redux store.
 * Mounted in root layout to run on every page.
 */

"use client";

import { useSessionSync } from "@/hooks/useSessionSync";

export function SessionSync() {
  useSessionSync();
  return null; // This component doesn't render anything
}
