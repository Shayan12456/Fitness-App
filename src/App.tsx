import { useEffect, useState } from 'react';
import { 
  Footprints, 
  Flame, 
  Target, 
  Dumbbell, 
  Bike, 
  FileWarning as Running,
  List,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Streak from './components/Streak';
import axios from 'axios';
import Switch from './components/Switch';
import Badges from './components/Badges';
import MoodPicker from './components/MoodPicker';

const data = [
  { 
    day: 'Mon', 
    steps: 8234, 
    lastWeekSteps: 7234,
    calories: 1248,
    lastWeekCalories: 1150,
    goalProgress: 67,
    lastWeekGoalProgress: 62
  },
  { 
    day: 'Tue', 
    steps: 9000, 
    lastWeekSteps: 8890,
    calories: 1180,
    lastWeekCalories: 1320,
    goalProgress: 65,
    lastWeekGoalProgress: 70
  },
  { 
    day: 'Wed', 
    steps: 9200, 
    lastWeekSteps: 8200,
    calories: 1380,
    lastWeekCalories: 1230,
    goalProgress: 75,
    lastWeekGoalProgress: 68
  },
  { 
    day: 'Thu', 
    steps: 8700, 
    lastWeekSteps: 7700,
    calories: 700,
    lastWeekCalories: 1155,
    goalProgress: 72,
    lastWeekGoalProgress: 64
  },
  { 
    day: 'Fri', 
    steps: 9600, 
    lastWeekSteps: 8600,
    calories: 1440,
    lastWeekCalories: 1290,
    goalProgress: 70,
    lastWeekGoalProgress: 72
  },
  { 
    day: 'Sat', 
    steps: 7400, 
    lastWeekSteps: 6400,
    calories: 1110,
    lastWeekCalories: 960,
    goalProgress: 32,
    lastWeekGoalProgress: 53
  },
  { 
    day: 'Sun', 
    steps: 8100, 
    lastWeekSteps: 7100,
    calories: 1215,
    lastWeekCalories: 1065,
    goalProgress: 98,
    lastWeekGoalProgress: 59
  }
];

const activities = [
  { 
    name: 'Running',
    icon: Running,
    duration: '45 min',
    distance: '5.2 km',
    calories: 420
  },
  {
    name: 'Cycling',
    icon: Bike,
    duration: '1h 20min',
    distance: '18.5 km',
    calories: 380
  },
  {
    name: 'Workout',
    icon: Dumbbell,
    duration: '30 min',
    distance: '-',
    calories: 250
  }
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'steps' | 'calories' | 'goals'>('steps');
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState({city: ""});
  const [weather, setWeather] = useState({temp: 0, condition: ''});
// Generate 90 days of random streak data
const generateStreakData = (): { date: string; intensity: number }[] => {
  const data = [];
  const today = new Date();

  for (let i = 89; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    const intensity = Math.floor(Math.random() * 5); // 0 to 4
    const dateStr = day.toISOString().split('T')[0];

    data.push({ date: dateStr, intensity });
  }

  return data;
};

const activityStreak = generateStreakData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Get IP
        const { data: ipData } = await axios.get('https://api.ipify.org?format=json');
        const userIp = ipData.ip;
        setIp(userIp);

        // Step 2: Get Location Info
        const { data: locationData } = await axios.get(`http://ip-api.com/json/${userIp}`);
        setLocation(locationData);

        // Step 3: Get Weather Info
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${locationData.city}&appid=0cdf94539eb1afa2b5bcceb5770dfdfb`
        );

        const tempCelsius = Math.floor(weatherRes.data.main.temp - 273.15);
        const condition = weatherRes.data.weather[0].main;

        setWeather({ temp: tempCelsius, condition });
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  const getSuggestion = (condition: string) => {
    switch (condition) {
      case 'Clear':
        return '🏃 Great day for a run!';
      case 'Clouds':
        return '🚶 Perfect for a long walk.';
      case 'Rain':
        return '💪 Indoor workout recommended.';
      default:
        return '🔥 Stay active, stay strong!';
    }
  };
  const getMetricColor = (metric: 'steps' | 'calories' | 'goals') => {
    switch (metric) {
      case 'steps':
        return '#8B5CF6';
      case 'calories':
        return '#EF4444';
      case 'goals':
        return '#10B981';
      default:
        return '#8B5CF6';
    }
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'steps':
        return { current: 'steps', last: 'lastWeekSteps', label: 'Steps' };
      case 'calories':
        return { current: 'calories', last: 'lastWeekCalories', label: 'Calories' };
      case 'goals':
        return { current: 'goalProgress', last: 'lastWeekGoalProgress', label: 'Goal %' };
      default:
        return { current: 'steps', last: 'lastWeekSteps', label: 'Steps' };
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          {/* Logo */}
          <div onClick={()=>window.location.reload()} className="cursor-pointer flex items-center space-x-2">
            <Footprints className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold">FitTrack</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Switch
              enabled={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-4">
            {/* Weather Card */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300`}>
            <h3 className="text-lg font-semibold mb-4">🌤️ Weather</h3>
            {weather && location ? (
              <div className="text-sm text-white-700 dark:text-white-300 space-y-1">
                <p><strong>City:</strong> {location.city}</p>
                <p><strong>Temp:</strong> {weather.temp}°C</p>
                <p><strong>Condition:</strong> {weather.condition}</p>
                <p className="italic text-indigo-500 mt-2">{getSuggestion(weather.condition)}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Fetching weather and location...</p>
            )}
          </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-500 font-semibold">Level 5</span>
              <span>|</span>
              <span>1,400 XP</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-500">Next Badge in 600 XP</span>
            </div>
          </div>
          <Badges />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Steps</h3>
              <Footprints className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">8,439</p>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Goal: 10,000</p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Calories</h3>
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-3xl font-bold">1,248</p>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Daily Goal: 2,000</p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Goal Progress</h3>
              <Target className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold">67%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '67%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 mb-8`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold">Weekly Progress</h2>
            <div className="flex flex-wrap gap-2">
              <div className="flex space-x-2">
              <button
                onClick={() => setSelectedMetric('steps')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedMetric === 'steps' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-black'
                } transition-colors`}
              >
                Steps
              </button>
              <button
                onClick={() => setSelectedMetric('calories')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedMetric === 'calories' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-black'
                } transition-colors`}
              >
                Calories
              </button>
              <button
                onClick={() => setSelectedMetric('goals')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedMetric === 'goals' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-black'
                } transition-colors`}
              >
                Goals
              </button>
              </div>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  compareMode ? 'bg-purple-500 text-white' : 'bg-gray-100 text-black dark:bg-black-700'
                } transition-colors`}
              >
                Compare with Last Week
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="day" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1F2937' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  name={`This Week's ${getMetricData().label}`}
                  type="monotone" 
                  dataKey={getMetricData().current}
                  stroke={getMetricColor(selectedMetric)}
                  strokeWidth={2}
                  dot={{ fill: getMetricColor(selectedMetric) }}
                />
                {compareMode && (
                  <Line 
                    name={`Last Week's ${getMetricData().label}`}
                    type="monotone" 
                    dataKey={getMetricData().last}
                    stroke="#9CA3AF"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#9CA3AF' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Streak Calendar */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 mb-8`}>
          {/* <Streak /> */}
          <Streak data={activityStreak} darkMode={darkMode} />
        </div>

        {/* Activity Summary */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Activity Summary</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsListView(false)}
                className={`p-2 rounded ${!isListView ? 'bg-purple-500 text-black' : 'bg-gray-100 text-black dark:bg-gray-700'}`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsListView(true)}
                className={`p-2 rounded ${isListView ? 'bg-purple-500 text-black' : 'bg-gray-100 text-black dark:bg-gray-700'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          {isListView ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div 
                  key={index}
                  className={`${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-4">
                    <activity.icon className="h-6 w-6 text-purple-500" />
                    <h3 className="text-lg font-semibold">{activity.name}</h3>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span>{activity.duration}</span>
                    <span>{activity.distance}</span>
                    <span>{activity.calories} cal</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activities.map((activity, index) => (
                <div 
                  key={index} 
                  className={`${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{activity.name}</h3>
                    <activity.icon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
                    <p>Duration: {activity.duration}</p>
                    <p>Distance: {activity.distance}</p>
                    <p>Calories: {activity.calories}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <MoodPicker />
      </main>
    </div>
  );
}

export default App;