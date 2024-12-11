"use client";

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/app/apiRequests/auth";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      // không nên đưa logic lấy accesstoken và refreshtoken ra khỏi function này "checkAndRefreshToken"
      // vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta sẽ có accesstoken và refreshtoken mới
      //   tránh hiện tượng bug chạy accesstoken và refreshtoken cũ
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromLocalStorage();
      // chưa đăng nhập thì không cho chạy
      if (!accessToken || !refreshToken) return;
      const decodeAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodeRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      const now = Math.round(new Date().getTime() / 1000);
      // trường hợp refreshToken hết hạng thì ko xử lý nữa
      if (decodeRefreshToken.exp <= now) return;
      // ví dụ trường hợp accessToken có thời gian là 10s
      // thì mình kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refreshToken chạy
      // thời gian còn lại sẽ tính theo công thức: decodeAccessToken.exp - decodeAccessToken.iat
      if (
        decodeAccessToken.exp - now <
        (decodeAccessToken.exp - decodeAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.refreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
            console.error("Failed to refresh token", error);
          clearInterval(interval);
        }
      }
    };
    checkAndRefreshToken();
 
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
