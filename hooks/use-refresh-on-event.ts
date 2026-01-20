import { useEffect, useState } from "react";

export function createRefreshEvent() {
  const listeners = new Set<() => void>();

  const trigger = () => {
    listeners.forEach((listener) => listener());
  };

  const useRefresh = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
      const refresh = () => setRefreshKey((prev) => prev + 1);
      listeners.add(refresh);
      return () => {
        listeners.delete(refresh);
      };
    }, []);

    return refreshKey;
  };

  return { trigger, useRefresh };
}
