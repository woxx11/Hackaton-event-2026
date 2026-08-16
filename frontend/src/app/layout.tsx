import type { Metadata } from "next";
import { Toaster } from "sonner";
import { getLocale } from "@/lib/i18n/getDictionary";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Hisobim — do‘koningiz hisobi", template: "%s | Hisobim" },
  description: "Do‘kon mahsulotlari, mijozlari va qarzlarini Hisobim bilan boshqaring.",
  applicationName: "Hisobim",
  keywords: ["Hisobim", "qarz daftari", "do'kon hisobi", "CRM", "Uzbekistan", "POS"],
  icons: { icon: "/logo.png" },
  openGraph: { title: "Hisobim", description: "Do‘koningiz hisobi — bir joyda.", images: ["/logo.png"] },
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" theme="light" />
      </body>
    </html>
  );
}
