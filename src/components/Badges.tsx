import { Medal, Award, Trophy, Star } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

const badges = [
  { icon: Medal, name: 'Early Bird', description: 'Completed 5 morning workouts' },
  { icon: Award, name: 'Step Master', description: '10,000 steps for 7 days straight' },
  { icon: Trophy, name: 'Fitness Warrior', description: 'Completed 30 workouts' },
  { icon: Star, name: 'Goal Crusher', description: 'Achieved all daily goals' },
];

export default function Badges() {
  return (
    <div className="flex space-x-2">
      {badges.map((badge, index) => (
        <div key={index}>
          <badge.icon
            data-tooltip-id={`badge-${index}`}
            className="h-6 w-6 text-yellow-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <Tooltip id={`badge-${index}`} place="bottom">
            <div className="text-left">
              <p className="font-bold">{badge.name}</p>
              <p className="text-sm">{badge.description}</p>
            </div>
          </Tooltip>

        </div>
      ))}
    </div>
  );
}