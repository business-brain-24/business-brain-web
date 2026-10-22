import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Business Brain 24 — Run your business. Ask it anything.",
    template: "%s · Business Brain 24",
  },
  description:
    "The AI-centric ERP for growing businesses. HR, payroll, finance, purchasing, inventory, sales and manufacturing in one live record, with AI at the core and our own MCP server for ChatGPT and Claude. Configured for Bangladesh.",
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
