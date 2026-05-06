import { ReactNode } from "react";
import HigherLearningMasthead from "./_components/HigherLearningMasthead";
export const dynamic = 'force-dynamic';

export default function HigherLearningLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HigherLearningMasthead />
      {children}
    </>
  );
}
