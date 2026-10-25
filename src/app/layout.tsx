import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Business Brain 24 — Do More. Spend Less.",
    template: "%s · Business Brain 24",
  },
  description:
    "The agentic ERP that cuts operating costs and lifts productivity across your enterprise. Finance, HR, payroll, procurement, inventory, sales, manufacturing and more in one connected system, with AI at the core.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
