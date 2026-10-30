import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import RouteTracker from "@/components/analytics/RouteTracker";
import ConsentBanner, { consentDefaultsScript } from "@/components/analytics/Consent";
import ChatWidget from "@/components/layout/ChatWidget";
import JsonLd, { organizationLd, websiteLd } from "@/components/seo/JsonLd";
import { ANALYTICS_HOST, GA4_ID, GTM_ID } from "@/lib/analytics";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { fontVariables } from "@/lib/fonts";

const description =
  "The agentic ERP that cuts operating costs and lifts productivity across your enterprise. Finance, HR, payroll, procurement, inventory, sales, manufacturing and more in one connected system, with AI at the core.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Business Brain: Do More. Spend Less.",
    template: "%s · Business Brain",
  },
  description,
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    url: "/",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image", images: ["/og/default.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        {/* Consent Mode defaults must exist before GTM loads. */}
        <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />
        {/* GA4 config queues ahead of the first page_view; RouteTracker sends page views, so the tag does not. */}
        {GA4_ID && <script dangerouslySetInnerHTML={{ __html: `if(location.hostname==='${ANALYTICS_HOST}'){gtag('js',new Date());gtag('config','${GA4_ID}',{send_page_view:false});}` }} />}
        <JsonLd data={[organizationLd, websiteLd]} />
      </head>
      <body>
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {GA4_ID && <Script id="ga4" src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />}
        <RouteTracker />
        <SmoothScroll>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
        <ConsentBanner />
        <ChatWidget />
      </body>
    </html>
  );
}
