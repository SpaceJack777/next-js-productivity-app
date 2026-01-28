import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Spinner } from "@/components/ui/spinner";
import { PropsWithChildren, Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Productivity App",
  description: "Your productivity companion",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <Spinner className="size-6" />
            </div>
          }
        >
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
