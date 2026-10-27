import LandingPage, { landingMetadata } from "../_components/LandingPage";

export const metadata = landingMetadata;

/** Campaign URL kept for ads and links already shared; it is the home page, so its canonical is "/". */
export default function DoMoreSpendLess() {
  return <LandingPage />;
}
