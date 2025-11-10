import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CheckinData {
  weight?: string;
  sleep?: string;
  energy?: string;
  mood?: string;
  notes?: string;
}

interface Checkin {
  id: string;
  userId: string;
  userName?: string;
  weight?: string;
  sleep?: string;
  energy?: string;
  mood?: string;
  notes?: string;
  timestamp: number;
  aiAnalysis?: string;
}

export function useCheckin() {
  const queryClient = useQueryClient();

  // Get user's check-ins
  const { data: checkinsData, isLoading } = useQuery({
    queryKey: ["checkins"],
    queryFn: async () => {
      const res = await fetch("/api/checkins", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch check-ins");
      return res.json();
    },
  });

  // Submit new check-in
  const submitMutation = useMutation({
    mutationFn: async (entry: CheckinData) => {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error("Failed to submit check-in");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkins"] });
    },
  });

  return {
    checkins: (checkinsData?.checkins || []) as Checkin[],
    loading: isLoading,
    submitting: submitMutation.isPending,
    submitCheckin: submitMutation.mutate,
    lastCheckin: submitMutation.data?.checkin as Checkin | undefined,
  };
}

// Hook for coaches to see all check-ins
export function useAllCheckins() {
  const { data: checkinsData, isLoading } = useQuery({
    queryKey: ["checkins-all"],
    queryFn: async () => {
      const res = await fetch("/api/checkins/all", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch all check-ins");
      return res.json();
    },
  });

  return {
    checkins: (checkinsData?.checkins || []) as Checkin[],
    loading: isLoading,
  };
}

