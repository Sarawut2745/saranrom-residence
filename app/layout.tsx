import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DormitoryProvider } from "@/lib/store/dormitory-context";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AppShell } from "@/components/common/AppShell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "เดอะ สราญรมย์ เรสซิเดนซ์ | The Saranrom Residence & Apartment",
  description: "ระบบบริหารจัดการหอพักและอพาร์ตเมนต์รายเดือน The Saranrom Residence & Apartment",
  keywords: ["หอพักรายเดือน", "อพาร์ตเมนต์", "ระบบจัดการหอพัก", "The Saranrom", "เดอะ สราญรมย์"],
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" href="/logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Prompt:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,600&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DormitoryProvider>
          <AppShell>
            <Navbar />
            <main style={{ minWidth: 0, width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
              {children}
            </main>
            <Footer />
          </AppShell>
        </DormitoryProvider>
      </body>
    </html>
  );
}
