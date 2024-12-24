import { Role } from "@/constants/type";
import { decodeToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. chưa đăng nhập sẽ không cho vào trang privatePaths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // 2. Trường hợp đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào tang login sẽ redirect về trang chính
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // 2.2 Nhưng accessToken bị hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    // 2.3 Trường hợp vào không đúng role thì redirect về trang chính
    const role = decodeToken(refreshToken).role;
    // Guest nhưng cố vào trang router path
    const isGuestGotoManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    // không phải Guest nhưng cố vào router guest
    const isNotGuestGotoGuestPath =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));
      console.log(isGuestGotoManagePath, isNotGuestGotoGuestPath);
    if (isGuestGotoManagePath || isNotGuestGotoGuestPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/manage/:path*","/guest/:path*", "/login"],
};
