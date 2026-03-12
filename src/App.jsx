import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HealthDataProvider } from './context/HealthDataContext'
import MoodTracker from './modules/MoodTracker'
import ExerciseTracker from './modules/ExerciseTracker'
import FoodTracker from './modules/FoodTracker'
import DailyGraph from './components/DailyGraph'
import WeeklyGraph from './components/WeeklyGraph'
import ExerciseGraph from './components/ExerciseGraph'
import CalorieGraph from './components/CalorieGraph'
import LifestyleSuggestions from './components/LifestyleSuggestions'
import HistoryView from './components/HistoryView'
import FileManager from './components/FileManager'

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme !== 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-page-from to-page-to transition-colors duration-200">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-text-main mb-2 transition-colors">
                {t('app.title')}
              </h1>
              <p className="text-text-muted transition-colors">
                {t('app.subtitle')}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 bg-surface text-text-main border border-border-main rounded-md shadow-sm hover:bg-surface-hover transition outline-none"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">{t('app.english')}</option>
                <option value="ja">{t('app.japanese')}</option>
              </select>
              <select
                className="px-3 py-2 bg-surface text-text-main border border-border-main rounded-md shadow-sm hover:bg-surface-hover transition outline-none"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">{t('app.themes.light')}</option>
                <option value="dark">{t('app.themes.dark')}</option>
                <option value="coastal">{t('app.themes.coastal')}</option>
                <option value="sunset">{t('app.themes.sunset')}</option>
                <option value="forest">{t('app.themes.forest')}</option>
                <option value="lavender">{t('app.themes.lavender')}</option>
              </select>
            </div>
          </header>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard'
                    ? 'border-indigo-500 text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('nav.dashboard')}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                    ? 'border-indigo-500 text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('nav.history')}
              </button>
              <button
                onClick={() => setActiveTab('exercise')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'exercise'
                    ? 'border-indigo-500 text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('nav.exercise')}
              </button>
              <button
                onClick={() => setActiveTab('food')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'food'
                    ? 'border-indigo-500 text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('nav.food')}
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'data'
                    ? 'border-indigo-500 text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('nav.dataManagement')}
              </button>
            </nav>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <LifestyleSuggestions />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MoodTracker />
                <DailyGraph />
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-text-main mb-4">Weekly Trends</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <WeeklyGraph />
                  <ExerciseGraph />
                  <CalorieGraph />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exercise' && (
            <div className="space-y-6">
              <div className="max-w-xl mx-auto">
                <ExerciseTracker />
              </div>
            </div>
          )}

          {activeTab === 'food' && (
            <div className="space-y-6">
              <div className="max-w-xl mx-auto">
                <FoodTracker />
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
