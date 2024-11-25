import authapiRequest from "@/app/apiRequests/auth";
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
    const result = await authapiRequest.sLogout({
      accessToken,
      refreshToken,
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
