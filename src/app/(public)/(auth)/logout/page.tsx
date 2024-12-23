"use client";
import { useLogoutMutation } from "@/app/queries/useAuth";
import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Logout(){
const { mutateAsync } = useLogoutMutation();
const { setRole } = useAppContext();
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
      setRole();
      router.push("/login");
    });
  } else {
    router.push("/");
  }
}, [mutateAsync, router, refreshTokenFormUrl, accessTokenFormUrl, setRole]);

return <div>Log out....</div>;
}
export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
