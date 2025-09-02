"use client";
import { useAuthCtx } from "@/components/auth/AuthProvider";
export function useAuth() {
  const { user } = useAuthCtx();
  return { user, isLoggedIn: !!user };
}
