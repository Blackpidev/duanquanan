import http from "@/lib/http"
import { AccountResType } from "@/schemaValidations/account.schema";

const apiAccountProfile = {
  me: () => http.get <AccountResType>("/accounts/me"),
};

export default apiAccountProfile