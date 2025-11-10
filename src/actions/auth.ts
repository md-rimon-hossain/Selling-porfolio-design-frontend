/**
 * OAuth Sign-In Action (Server Action)
 *
 * Use this in your login page to trigger OAuth sign-in
 * with Google or GitHub.
 *
 * For NextAuth v4, we use signIn from next-auth/react
 */

"use server";

import { signIn } from "next-auth/react";

export async function signInWithGoogle() {
  // This will be called from client component
  // Return the provider name so client can handle it
  return { provider: "google" };
}

export async function signInWithGitHub() {
  // This will be called from client component
  // Return the provider name so client can handle it
  return { provider: "github" };
}
