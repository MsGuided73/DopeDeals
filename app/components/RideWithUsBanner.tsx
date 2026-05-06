"use client";

import Image from "next/image";
import Link from "next/link";

const BANNER_SRC =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/RideWithUs/RIDE%20WITH%20US%20HOME%20PAGE%20IMAGE.png";

/**
 * Homepage "Ride with Us" banner. Click navigates to the dedicated VIP
 * landing/signup page at /h420-vip — previously this triggered an inline
 * modal with a duplicate signup form, which has been removed in favor of
 * the canonical /h420-vip conversion page.
 */
export default function RideWithUsBanner() {
  return (
    <section
      aria-label="Ride with Us"
      className="w-full relative"
      style={{ background: "transparent" }}
    >
      <Link
        href="/h420-vip"
        aria-label="Join the Highway 420 VIP community"
        style={{
          width: "100%",
          display: "block",
          position: "relative",
        }}
      >
        <Image
          src={BANNER_SRC}
          alt="Ride with Us — join the Highway 420 community"
          width={2400}
          height={800}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="block"
          priority
        />
      </Link>
    </section>
  );
}
