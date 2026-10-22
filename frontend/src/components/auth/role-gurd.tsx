"use client";

import { useGetMe } from "@/hooks";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";
import AccessDenied from "../errors/access-denied";

 

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { data, isPending, isError } = useGetMe();
  const router = useRouter();

  const user = data?.data;

  const isAuthorized = user && allowedRoles.includes(user.role as UserRole);

  useEffect(() => {
    if (isPending) return;

    if (isError || !user) {
      router.replace("/login");
      return;
    }
  }, [user, isPending, isError, router]);

  if (isPending) {
    return <AuthLoading value="Verifying your account..." />;
  }

  if (isError || !user) {
    return <AuthLoading value="Redirecting to login..." />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}