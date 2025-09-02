"use client";

import { User } from "@/types/auth";
import { useContext, useMemo } from "react";
import { createContext } from "react";

type AuthCtxValue = { user: User | null };
const AuthCtx = createContext<AuthCtxValue>({ user: null });

export function AuthProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ user }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuthCtx() {
  return useContext(AuthCtx);
}
