import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";
import { GuestLoginBodyType } from "@/schemaValidations/guest.schema";
import guestApiRequest from "@/app/apiRequests/guest";

export async function POST(request: Request) {
  const res = (await request.json()) as GuestLoginBodyType;
  const cookieStore = cookies();
  try {
    const { payload } = await guestApiRequest.sLogin(res);
    const { accessToken, refreshToken } = payload.data;
    const decodeAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000
    });
    // localStorage.setItem("refreshToken", refreshToken);
    // localStorage.setItem("accessToken", accessToken);
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError){
        return Response.json(error.payload, {
            status: error.status
        });
    }else {
        console.error(error);
        return Response.json({
            message: "Có lỗi xảy ra"
        }, {
            status: 500
        });
    }
  }


}
