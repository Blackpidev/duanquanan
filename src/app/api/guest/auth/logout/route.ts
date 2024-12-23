import guestApiRequest from "@/app/apiRequests/guest";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!accessToken || !refreshToken) {
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
    const result = await guestApiRequest.sLogout({
      accessToken,
      refreshToken,
    });
    cookieStore.set("accessToken", '', {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(0),
    });
    cookieStore.set("refreshToken", '', {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(0),
    });
    return Response.json(result);
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
