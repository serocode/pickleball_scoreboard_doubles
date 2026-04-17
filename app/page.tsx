import { PickleballDashboard } from '@/components/pickleball/dashboard';

export const metadata = {
  title: 'Pickleball Scorer',
  description: 'Interactive doubles pickleball scoring system with official rules',
};

export default function Home() {
  return <PickleballDashboard />;
}
