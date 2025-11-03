import { Metadata } from 'next';
import UltimateBongGuideClient from './UltimateBongGuideClient';

export const metadata: Metadata = {
  title: 'The Ultimate Guide to Picking the Perfect Bong | Highway 420',
  description: 'From desktop beasts to pocket rockets — bongs that hit different. Water filtration, massive rips, and glass art that belongs in museums (or your living room).',
  keywords: 'bongs, water pipes, smoking accessories, cannabis, glass art, filtration, vapor quality',
  openGraph: {
    title: 'The Ultimate Guide to Picking the Perfect Bong',
    description: 'Master the art of bong selection with our comprehensive guide covering everything from beginner basics to advanced techniques.',
    type: 'article',
  },
};

export default function UltimateBongGuide() {
  return <UltimateBongGuideClient />;
}
