import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateBatteryLogInput } from "@shared/routes";

export function useBatteryLogs() {
  return useQuery({
    queryKey: [api.batteryLogs.list.path],
    queryFn: async () => {
      const res = await fetch(api.batteryLogs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch battery logs");
      return api.batteryLogs.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateBatteryLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBatteryLogInput) => {
      const res = await fetch(api.batteryLogs.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log battery status");
      return api.batteryLogs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.batteryLogs.list.path] }),
  });
}
