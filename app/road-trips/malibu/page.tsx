import TripComingSoon from "../_components/TripComingSoon";

const HERO = "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Malibu%20Sessions.png";

export const metadata = {
  title: "Malibu Sessions | Highway 420 Road Trips",
  description:
    "Pacific Coast Highway pull-offs, sunset hangs, and laid-back coastal sessions. Malibu trip guide coming soon.",
};

export default function MalibuPage() {
  return (
    <TripComingSoon
      name="Malibu Sessions"
      tagline="Coastal pull-offs. Easy hangs. Sunset sessions on the PCH."
      heroImage={HERO}
      heroAlt="Vintage camper van and friends watching sunset over Malibu coast"
      pills={[
        { label: "Malibu", dot: "amber" },
        { label: "Coastal", dot: "teal" },
        { label: "Featured Trip", dot: "green" },
      ]}
      description="Cruise PCH, chase the sun, and stop wherever it feels right. We're finalizing the El Matador / Zuma / Topanga stop set and the kit picks — full guide drops shortly."
    />
  );
}
