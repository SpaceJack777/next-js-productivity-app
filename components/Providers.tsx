"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import { PomodoroProvider } from "@/contexts/pomodoro-context";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PomodoroProvider>
          {children}
          <Toaster />
        </PomodoroProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
