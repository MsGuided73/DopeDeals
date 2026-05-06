import H420VipClient from "./H420VipClient";

export const metadata = {
  title: "Highway 420 VIP — Join the Ride. Unlock VIP Perks.",
  description:
    "Free VIP membership. Early access to drops, member-only pricing, exclusive products, free gifts and testers. No spam — just better sessions.",
  alternates: {
    canonical: "https://highway420store.com/h420-vip",
  },
  openGraph: {
    title: "Highway 420 VIP — Join the Ride. Unlock VIP Perks.",
    description:
      "Free VIP membership. Early access, member pricing, exclusive drops, gifts & testers.",
    type: "website",
    url: "https://highway420store.com/h420-vip",
  },
};

export default function H420VipPage() {
  return <H420VipClient />;
}
