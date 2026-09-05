import { useCallback, useEffect, useState } from "react";
import {
  defaultDrafts,
  EXAMPLE_PROCESSES,
  emptyDraft,
  type ProcessDraft,
} from "@/lib/scheduling/validation";

const STORAGE_KEY = "cpu-scheduler:processes";

/** Process rows shared between the Visualizer and Comparison pages. */
export function useProcessDrafts() {
  const [drafts, setDrafts] = useState<ProcessDraft[]>(() => defaultDrafts(4));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProcessDraft[];
        if (Array.isArray(parsed) && parsed.length) setDrafts(parsed);
      }
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch {
      /* storage unavailable */
    }
  }, [drafts, hydrated]);

  const update = useCallback((index: number, field: keyof ProcessDraft, value: string) => {
    setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  }, []);

  const add = useCallback(() => {
    setDrafts((prev) => [...prev, emptyDraft(prev.length + 1)]);
  }, []);

  const remove = useCallback((index: number) => {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeLast = useCallback(() => {
    setDrafts((prev) => prev.slice(0, -1));
  }, []);

  const loadExample = useCallback(() => setDrafts(EXAMPLE_PROCESSES.map((p) => ({ ...p }))), []);
  const clear = useCallback(() => setDrafts([]), []);

  return { drafts, setDrafts, update, add, remove, removeLast, loadExample, clear };
}
