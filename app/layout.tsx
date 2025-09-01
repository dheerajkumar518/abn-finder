import { AppSidebar, AppTopNav } from "@/components/layout/SideNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABN Finder",
  description: "Find Australian Business Numbers (ABNs) easily",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Mobile top nav */}
          <Suspense fallback={<div>Loading...</div>}>
            <AppTopNav />
          </Suspense>
          <div className="min-h-screen mx-auto flex w-full ">
            <Suspense fallback={<div>Loading...</div>}>
              <AppSidebar />
            </Suspense>

            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
