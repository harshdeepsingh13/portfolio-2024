import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  disconnectLinkedIn,
  getLinkedInStatus,
  shareToLinkedIn,
  type LinkPlacement,
} from "@/services/integrations/linkedin";

export function useLinkedInStatus() {
  return useQuery({
    queryKey: ["linkedinStatus"],
    queryFn: getLinkedInStatus,
  });
}

export function useDisconnectLinkedIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectLinkedIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linkedinStatus"] });
    },
  });
}

export function useShareToLinkedIn() {
  return useMutation({
    mutationFn: ({
      id,
      commentary,
      linkPlacement,
    }: {
      id: string;
      commentary: string;
      linkPlacement: LinkPlacement;
    }) => shareToLinkedIn(id, { commentary, linkPlacement }),
  });
}
