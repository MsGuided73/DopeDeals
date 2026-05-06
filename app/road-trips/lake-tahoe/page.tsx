import TripComingSoon from "../_components/TripComingSoon";

const HERO = "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/General%20Community/Vintage%20camper%20van%20in%20mountain%20clearing.png";

export const metadata = {
  title: "Lake Tahoe Escape | Highway 420 Road Trips",
  description:
    "Crystal water, pine forests, mountain switchbacks — the Tahoe loop is coming soon. Stops, gear, and the Emerald Bay overlook scoped and ready.",
};

export default function LakeTahoePage() {
  return (
    <TripComingSoon
      name="Lake Tahoe Escape"
      tagline="Crystal clear water. Pine forests. The loop drive every road-tripper bookmarks."
      heroImage={HERO}
      heroAlt="Vintage camper van parked in a mountain clearing — Lake Tahoe trip placeholder"
      pills={[
        { label: "Lake Tahoe", dot: "amber" },
        { label: "Mountain Loop", dot: "teal" },
        { label: "Featured Trip", dot: "green" },
      ]}
      description="Tahoe is the trip we're most excited to ship. Loop drive around the lake, the Emerald Bay overlook, Lakeside Rock Cove for a swim, Forest Pull-Off for a quiet break. We're commissioning the route map illustration now — back soon with the full guide."
    />
  );
}
