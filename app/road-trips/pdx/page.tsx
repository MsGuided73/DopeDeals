import TripComingSoon from "../_components/TripComingSoon";

const HERO =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/PDX%20Keep%20riding.png";

export const metadata = {
  title: "PDX Day Sessions | Highway 420 Road Trips",
  description:
    "Bridges, food carts, and PNW vibes. Highway 420's Portland day-session guide is coming soon.",
};

export default function PdxPage() {
  return (
    <TripComingSoon
      name="PDX Day Sessions"
      tagline="Bridges. Food carts. PNW vibes."
      heroImage={HERO}
      heroAlt="Portland skyline with bridge and PNW landscape"
      pills={[
        { label: "Portland", dot: "green" },
        { label: "Oregon", dot: "teal" },
        { label: "Urban", dot: "amber" },
      ]}
      description="Portland's neighborhoods, riverwalks, and food-truck stops — paired with the dispensary picks that locals actually rate. We're putting the full day-by-day together; check back soon."
    />
  );
}
