import apiAccountRequest from "@/app/apiRequests/account";
import { GetGuestListQueryParamsType, UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    mutationFn: apiAccountRequest.changePasswordV2,
  });
};

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: apiAccountRequest.list,
  });
};

export const useGetAccount = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => apiAccountRequest.getEmployee(id),
    enabled
  });
};

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiAccountRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & { id: number }) =>
      apiAccountRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
        exact: true
      });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiAccountRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useGetGuestListQuery = (queryParams: GetGuestListQueryParamsType) => {
  return useQuery({
    queryKey: ["guests", queryParams],
    queryFn: () => apiAccountRequest.guestList(queryParams),
  });
}

export const useCreateGuestMutation = () => {
  return useMutation({
    mutationFn: apiAccountRequest.createGuest
  })
}