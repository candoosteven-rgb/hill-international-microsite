import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import { AppStateProvider } from "@/lib/app-state";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Hill International | New homes across the UK",
  description:
    "Explore Hill International's portfolio of new-home developments across London, Cambridge, Oxford and Bristol, with support in your language.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
