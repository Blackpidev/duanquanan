import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authapiRequest = {
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", body),

  // gọi đến api next server nên truyền baseUrl = ""
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
        baseUrl: ""
    }),
};

export default authapiRequest;