"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import { PomodoroProvider } from "@/contexts/pomodoro-context";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PomodoroProvider>{children}</PomodoroProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
