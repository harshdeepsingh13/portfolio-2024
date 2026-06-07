import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost } from "@/services/blog/posts";

export function useCreatePost() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => createPost(payload),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      updatePost(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["blogPost", id] });
    },
  });
}
