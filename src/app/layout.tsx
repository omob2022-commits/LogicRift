import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "LogicRift | من الفكرة إلى متطلبات واضحة",
  description:
    "مساحة عربية للشركات وزبائنها لجمع متطلبات المشاريع ومراجعتها وتتبع مصادرها.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
