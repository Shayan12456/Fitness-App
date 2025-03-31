// components/Streak.tsx
import React from 'react';

interface Day {
  date: string;
  intensity: number;
}

interface StreakProps {
  data: Day[];
  darkMode: boolean;
}

const Streak: React.FC<StreakProps> = ({ data, darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 mb-8`}>
      <h2 className="text-xl font-bold mb-4">🔥 Activity Streak (Last 90 Days)</h2>
      <div className="grid grid-cols-18 gap-1 overflow-auto max-w-full">
        {data.map((day, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-sm"
            style={{
              backgroundColor:
                day.intensity === 0 ? (darkMode ? '#374151' : '#e5e7eb') :
                day.intensity === 1 ? '#c7d2fe' :
                day.intensity === 2 ? '#a5b4fc' :
                day.intensity === 3 ? '#818cf8' :
                '#6366f1',
            }}
            title={`${day.date} • Activity Level: ${day.intensity}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Streak;
