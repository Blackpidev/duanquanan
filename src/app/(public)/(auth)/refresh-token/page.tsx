"use client";
import {
    checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RefreshToken() {
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
  } else {
    router.push("/");
  }
}, [router, refreshTokenFormUrl, redirectPathname]);
return <div>RefreshToken...</div>
}
export default function RefreshTokenPage() {
  
  return(

    <Suspense fallback = {<div>loading....</div>}>
      <RefreshToken />
    </Suspense>
  )
}
