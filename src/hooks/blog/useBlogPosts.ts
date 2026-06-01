import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, listAllPosts } from "@/services/blog/posts";

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: listAllPosts,
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogPosts"] }),
  });
}
