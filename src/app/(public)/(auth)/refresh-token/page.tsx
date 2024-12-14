"use client";
import {
    checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFormUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");
  useEffect(() => {
    if (
      refreshTokenFormUrl &&
      refreshTokenFormUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || "/");
        },
      });
    }else {
      router.push("/")
    }
  }, [router, refreshTokenFormUrl, redirectPathname]);
  return <div>Refresh token</div>;
}
