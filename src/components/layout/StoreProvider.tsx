"use client";

import { useEffect, useState } from "react";

/**
 * Prevents hydration mismatch with Zustand persist.
 * localStorage is only available client-side, so we must
 * wait for hydration before rendering store-dependent UI.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
