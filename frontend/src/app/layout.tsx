import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Hisobim — do‘koningiz hisobi", template: "%s | Hisobim" },
  description: "Do‘kon mahsulotlari, mijozlari va qarzlarini Hisobim bilan boshqaring.",
  applicationName: "Hisobim",
  keywords: ["Hisobim", "qarz daftari", "do'kon hisobi", "CRM", "Uzbekistan"],
  openGraph: { title: "Hisobim", description: "Do‘koningiz hisobi — bir joyda.", images: ["/hisobim-logo.png"] },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
