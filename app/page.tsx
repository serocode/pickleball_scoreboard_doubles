import { PickleballDashboard } from '@/components/pickleball/dashboard';

export const metadata = {
  title: 'Kitchen Counter | Live Scoreboard',
  description: 'Premium doubles pickleball scoring system with real-time tracking and analytics',
};

export default function Home() {
  return <PickleballDashboard />;
}
