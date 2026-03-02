import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["500", "600", "700"],
});


export const metadata: Metadata = {
  title: "ImRabo Web Intelligence",
  description: "AI Brain + Memory + Automation platform",
};

// ensureInitialUser();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <body>
        <ThemeProvider>
          <main>{children}</main>
          <Toaster
            duration={3000}
            position="top-center"
            richColors
            expand={false}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

