import { ReactNode } from "react";
import HigherLearningMasthead from "./_components/HigherLearningMasthead";

export default function HigherLearningLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HigherLearningMasthead />
      {children}
    </>
  );
}
