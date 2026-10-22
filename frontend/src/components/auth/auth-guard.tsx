"use client";

import { useGetMe } from "@/hooks";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { data, isPending, isError } = useGetMe();

  const router = useRouter();
  const user = data?.data;

  useEffect(() => {
    if (isPending) return;

    if (isError || !user) {
      router.replace("/login");
    }
  }, [router, user, isError, isPending]);

  if (isPending) {
    return <AuthLoading value="Verifying your account..." />;
  }

  if (isError || !user) {
    return <AuthLoading value="Redirecting..." />;
  }

  return <>{children}</>;
}