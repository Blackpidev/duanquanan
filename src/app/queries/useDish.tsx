import apiDishRequest from "@/app/apiRequests/dishes";
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDishListQuery = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: apiDishRequest.list,
  });
};

export const useAddDishMutation = () => {
const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiDishRequest.addDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
}

export const useGetDishQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["dishes", id],
    queryFn: () => apiDishRequest.getDish(id),
    enabled,
  });
};

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      apiDishRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
        exact: true,
      });
    },
  });
};

export const useDeleteDishMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: apiDishRequest.deleteDish,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dishes"],
        });
      },
    });
  };

