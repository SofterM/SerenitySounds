import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

// กำหนด Kanit font
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"], // รองรับทั้งภาษาอังกฤษและไทย
  weight: ["400", "500", "700"], // น้ำหนักฟอนต์ที่ต้องการ
  display: "swap", // ช่วยให้ฟอนต์โหลดเร็วขึ้น
});

export const metadata: Metadata = {
  title: "SerenitySounds",
  description: "SerenitySounds",
  icons: {
    icon: "/logo2.png", // favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/logo2.png" as="image" />
      </head>
      <body className={`${kanit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}