import GlobalMasthead from '../components/GlobalMasthead';
import DopeDealsClient from './DopeDealsClient';

export const metadata = {
  title: "Dope Deals | HIGHWAY 420",
  description: "Exclusive Dope Deals at Highway 420. Find your next stop for premium gear and cannabis products.",
};

export default function DopeDealsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <GlobalMasthead />
      <div className="flex-1 flex flex-col">
        <DopeDealsClient />
      </div>
    </div>
  );
}
