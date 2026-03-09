import { useState, useEffect } from 'react'
import { HealthDataProvider } from './context/HealthDataContext'
import MoodTracker from './modules/MoodTracker'
import DailyGraph from './components/DailyGraph'
import WeeklyGraph from './components/WeeklyGraph'
import HistoryView from './components/HistoryView'
import FileManager from './components/FileManager'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">
                Mood Tracking App
              </h1>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Track how you feel over time with a simple 1–5 mood scale
              </p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </header>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'data'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Data Management
              </button>
            </nav>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MoodTracker />
                <DailyGraph />
                <WeeklyGraph />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryView />
          )}

          {activeTab === 'data' && (
            <FileManager />
          )}
        </div>
      </div>
    </HealthDataProvider>
  )
}

export default App
