import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateDiagnosticInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useDiagnostics() {
  return useQuery({
    queryKey: [api.diagnostics.list.path],
    queryFn: async () => {
      const res = await fetch(api.diagnostics.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch diagnostic results");
      return api.diagnostics.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDiagnostic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateDiagnosticInput) => {
      const res = await fetch(api.diagnostics.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save diagnostic result");
      }
      return api.diagnostics.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.diagnostics.list.path] });
      toast({
        title: "Result Saved",
        description: "Diagnostic test result has been logged successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
