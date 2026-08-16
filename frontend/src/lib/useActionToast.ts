"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useActionToast(state: { success?: string; error?: string }) {
  const last = useRef(state);
  useEffect(() => {
    if (state === last.current) return;
    last.current = state;
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);
}
