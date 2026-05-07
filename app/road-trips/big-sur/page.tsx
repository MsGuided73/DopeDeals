import TripComingSoon from "../_components/TripComingSoon";

const HERO =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Big%20Sur%20Keep%20Riding.png";

export const metadata = {
  title: "Big Sur Adventure | Highway 420 Road Trips",
  description:
    "Cliffside curves, redwood pull-offs, and Pacific air. Highway 420's Big Sur road-trip guide is coming soon.",
};

export default function BigSurPage() {
  return (
    <TripComingSoon
      name="Big Sur Adventure"
      tagline="Cliffside curves. Redwood pull-offs. Pacific air."
      heroImage={HERO}
      heroAlt="Big Sur coastal highway with redwoods and ocean views"
      pills={[
        { label: "Big Sur", dot: "teal" },
        { label: "California", dot: "amber" },
        { label: "Coastal", dot: "green" },
      ]}
      description="The most scenic stretch of Highway 1 — winding cliffs, redwood groves, and pull-offs made for unhurried sessions. We're mapping the stops and gear picks now; the full guide is on its way."
    />
  );
}
