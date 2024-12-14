"use client";
import { useLogoutMutation } from "@/app/queries/useAuth";
import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const { setIsAuth } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFormUrl = searchParams.get("refreshToken");
  const accessTokenFormUrl = searchParams.get("accessToken");
  const ref = useRef<any>(null);
  useEffect(() => {
    if (
      (ref.current &&
        refreshTokenFormUrl === getRefreshTokenFromLocalStorage()) ||
      (accessTokenFormUrl &&
        accessTokenFormUrl === getAccessTokenFromLocalStorage())
    ) {
      ref.current = mutateAsync;
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setIsAuth(false);
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFormUrl, accessTokenFormUrl, setIsAuth]);

  return <div>Log out....</div>;
}
