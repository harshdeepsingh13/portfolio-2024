import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/services/blog/posts";

export function useBlogPost(id: string | undefined) {
  return useQuery({
    queryKey: ["blogPost", id],
    queryFn: () => getPost(id!),
    enabled: Boolean(id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
