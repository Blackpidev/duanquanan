import apiAccountRequest from "@/app/apiRequests/account";
import authapiRequest from "@/app/apiRequests/auth";
import { ChangePasswordV2BodyType } from "@/schemaValidations/account.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export async function PUT(request: Request) {
  const cookieStore = cookies();
  const body = (await request.json()) as ChangePasswordV2BodyType;
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    return Response.json(
      {
        message: "Không nhận được accesstoken",
      },
      {
        status: 200,
      }
    );
  }
  try {
    console.log(accessToken);
    console.log(body);
    const {payload} = await apiAccountRequest.schangePasswordV2(
      accessToken,
      body
    );
    const accessTokenChange = payload.data.accessToken
    const refreshToken = payload.data.refreshToken
    const decodeAccessToken = jwt.decode(accessTokenChange) as { exp: number };
    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessTokenChange, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error) {
    return Response.json(
      {
        message: "Lỗi khi gọi đến api backend",
      },
      {
        status: 500,
      }
    );
  }
}
