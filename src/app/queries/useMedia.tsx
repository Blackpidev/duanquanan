import { mediaApiRequest } from "@/app/apiRequests/media";
import { useMutation } from "@tanstack/react-query";

export const useupdateMediaMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload,
  });
};
