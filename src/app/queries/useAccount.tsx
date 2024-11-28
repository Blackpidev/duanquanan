import apiAccountRequest from "@/app/apiRequests/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: apiAccountRequest.me,
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: apiAccountRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: apiAccountRequest.changePasswordV2
  });

}
