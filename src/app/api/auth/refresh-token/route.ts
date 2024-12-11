import authapiRequest from "@/app/apiRequests/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { RefreshTokenBodyType } from "@/schemaValidations/auth.schema";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json(
      {
        message: "Không tìm thất refreshToken",
      },
      {
        status: 401,
      }
    );
  }
  try {
    // const body = (await request.json()) as RefreshTokenBodyType;
    const { payload } = await authapiRequest.sRefreshToken({
        refreshToken
    });
    console.log("payload: ", payload);
    const decodeAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number;
    };
    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? "Có lỗi xảy ra",
      },
      {
        status: 401,
      }
    );
  }
}
