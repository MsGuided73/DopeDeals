import TripComingSoon from "../_components/TripComingSoon";

const HERO = "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Austin%20Chill%20Sessions.png";

export const metadata = {
  title: "Austin Chill Spot | Highway 420 Road Trips",
  description:
    "Laid-back hangs, local flavor, and the Austin scene. Highway 420's Austin road-trip guide is coming soon.",
};

export default function AustinPage() {
  return (
    <TripComingSoon
      name="Austin Chill Spot"
      tagline="Laid-back hangs. Local flavor. Texas-sized vibes."
      heroImage={HERO}
      heroAlt="Austin scenic skyline with chill outdoor session"
      pills={[
        { label: "Austin", dot: "amber" },
        { label: "Texas", dot: "teal" },
        { label: "Community", dot: "green" },
      ]}
      description="Local lounges, food-truck stops, and the river-side hangs Austin is known for. We're sourcing the photography and the dispensary picks now — full guide on its way."
    />
  );
}
