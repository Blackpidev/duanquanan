"use client";

import {
  checkAndRefreshToken,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;

    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      }
    });

    // timeout interval phải bé hơn thời gian hết hạn của accessToken
    // ví dụ thời gian hết hạn của accessToken là 10s thì 1s sẽ chạy checkAndRefreshToken
    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
  }, [pathname]);
  return null;
}
