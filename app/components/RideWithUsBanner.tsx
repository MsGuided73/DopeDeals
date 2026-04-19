import Image from "next/image";
import Link from "next/link";

const BANNER_SRC =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/RideWithUs/Ride%20with%20Us.png";

export default function RideWithUsBanner() {
  return (
    <section
      aria-label="Ride with Us"
      className="w-full"
      style={{ background: "#0D0D0B" }}
    >
      <Link
        href="/ride-with-us"
        aria-label="Ride with Us — join the Highway 420 community"
        className="group block w-full focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
      >
        <Image
          src={BANNER_SRC}
          alt="Ride with Us — join the Highway 420 community"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="block transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />
      </Link>
    </section>
  );
}
