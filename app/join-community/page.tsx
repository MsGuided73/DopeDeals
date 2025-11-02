import { Metadata } from 'next';
import JoinCommunityClient from './JoinCommunityClient';

export const metadata: Metadata = {
  title: 'Join Our Community - Highway 420 Newsletter',
  description: 'Join the Highway 420 community and get exclusive access to special events, product drops, and our weekly newsletter. Stay connected with the latest in premium cannabis culture.',
  keywords: 'Highway 420 newsletter, community join, cannabis newsletter, exclusive events, product drops, community membership',
  openGraph: {
    title: 'Join Our Community - Highway 420 Newsletter',
    description: 'Join the Highway 420 community and get exclusive access to special events, product drops, and our weekly newsletter.',
    type: 'website',
  },
};

export default function JoinCommunityPage() {
  return <JoinCommunityClient />;
}
