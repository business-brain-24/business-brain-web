import LandingPage, { landingMetadata } from "./_components/LandingPage";

export const metadata = landingMetadata;

/** Home page: the Do More. Spend Less. landing page. The previous home page lives at /overview. */
export default function Home() {
  return <LandingPage />;
}
