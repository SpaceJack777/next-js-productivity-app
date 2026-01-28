import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Spinner } from "@/components/ui/spinner";
import { PropsWithChildren, Suspense } from "react";
import "./globals.css";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";

export const metadata: Metadata = {
  title: "Productivity App",
  description: "Your productivity companion",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full">
        <GravityStarsBackground className="absolute inset-0 z-0" />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <Spinner className="size-6" />
            </div>
          }
        >
          <Providers>
            <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-12 sm:py-16">
              <div className="flex w-full max-w-md flex-col items-center justify-center space-y-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
                  <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
                    {"{ Space prod. }"}
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground">
                    productivity app
                  </p>
                </div>

                <div className="w-full">{children}</div>
              </div>
            </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
