import { Metadata } from "next";
import GlobalMasthead from "../components/GlobalMasthead";
import HigherLearningClient from "./HigherLearningClient";

export const metadata: Metadata = {
  title: "Higher Learning | Highway 420",
  description: "Your Guide to Better Sessions. Tips, guides, and expert advice to help you choose the right gear and improve your sessions.",
};

export default function HigherLearningPage() {
  return (
    <>
      <GlobalMasthead />
      <div className="bg-[#F7F6F2] min-h-screen">
        <HigherLearningClient />
      </div>
    </>
  );
}
