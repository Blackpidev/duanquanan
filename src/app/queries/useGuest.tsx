import guestApiRequest from "@/app/apiRequests/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};
export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};

export const useOrderGuestMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.ordersGuest,
  });
}

export const useGuestListOrderQuery = () => {
  return useQuery({
    queryKey: ["guest-orders"],
    queryFn: guestApiRequest.getOrdersGuest,
  });
}
