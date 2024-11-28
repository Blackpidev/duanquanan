import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const apiAccountRequest = {
  me: () => http.get<AccountResType>("/accounts/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", body),
  changerPassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>("/accounts/change-password", body),
};

export default apiAccountRequest;
