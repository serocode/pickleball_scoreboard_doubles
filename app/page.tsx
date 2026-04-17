import { PickleballDashboard } from '@/components/pickleball/dashboard';

export const metadata = {
  title: 'KINETIC COURT | Live Scoreboard',
  description: 'Premium doubles pickleball scoring system with real-time tracking and kinetic court visualization',
};

export default function Home() {
  return <PickleballDashboard />;
}
