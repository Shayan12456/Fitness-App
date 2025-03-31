import { useState } from 'react';

const moods = [
  { emoji: '😊', label: 'Great' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😩', label: 'Tired' },
];

export default function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">How do you feel after today's workout?</h3>
      <div className="flex space-x-4">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => setSelectedMood(index)}
            className={`text-2xl p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              selectedMood === index ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}