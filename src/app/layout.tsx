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

const SITE_TITLE = "Hill International | New homes across the UK";
const SITE_DESCRIPTION =
  "Explore Hill International's portfolio of new-home developments across London, Cambridge, Oxford and Bristol, with support in your language.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hill-intl.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Hill International",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
