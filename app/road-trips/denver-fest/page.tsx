import TripComingSoon from "../_components/TripComingSoon";

const HERO = "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Denver%20Cannabis%20Sessions.png";

export const metadata = {
  title: "Denver Cannabis Fest | Highway 420 Road Trips",
  description:
    "Crowds, music, and elevated energy. Highway 420's Denver Cannabis Fest guide is on the way.",
};

export default function DenverFestPage() {
  return (
    <TripComingSoon
      name="Denver Cannabis Fest"
      tagline="Crowds, music, and elevated energy at altitude."
      heroImage={HERO}
      heroAlt="Denver cannabis festival scene with crowd and stage lights"
      pills={[
        { label: "Denver", dot: "amber" },
        { label: "Event", dot: "teal" },
        { label: "Mile High", dot: "green" },
      ]}
      description="Festival schedule, dispensary picks, lounge spots, and the gear that travels best at altitude. We're locking in the 2026 fest dates and the writeup goes live as soon as that's confirmed."
    />
  );
}
