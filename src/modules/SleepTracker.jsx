import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'

function SleepTracker() {
  const { t } = useTranslation();
  const { addSleepEntry } = useHealthData()

  const [hoursSlept, setHoursSlept] = useState('')
  const [sleepQuality, setSleepQuality] = useState(null)

  const handleSubmit = () => {
    const hours = parseFloat(hoursSlept)
    if (isNaN(hours) || !sleepQuality) return

    const now = new Date()

    const newEntry = {
      id: Date.now(),
      hoursSlept: hours,
      sleepQuality: sleepQuality,
      timestamp: now.toISOString(),
      date: getTodayFormatted(),
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }

    addSleepEntry(newEntry)
    setHoursSlept('')
    setSleepQuality(null)
  }

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-text-main mb-4">
        {t('sleep.title')}
      </h2>
      <p className="text-text-muted mb-6">
        {t('sleep.description')}
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-text-main mb-2">
          {t('sleep.hoursLabel')}
        </label>
        <input
          type="number"
          step="0.5"
          min="0"
          max="24"
          value={hoursSlept}
          onChange={(e) => setHoursSlept(e.target.value)}
          placeholder={t('sleep.hoursPlaceholder')}
          className="w-full p-3 border rounded-lg bg-surface-hover text-text-main border-border-main focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-colors"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-text-main mb-2">
          {t('sleep.qualityLabel')}
        </label>
        <div className="flex justify-between space-x-2">
          {[1, 2, 3, 4, 5].map((quality) => (
            <button
              key={quality}
              onClick={() => setSleepQuality(quality)}
              className={`flex-1 py-3 rounded-lg font-semibold border transition-colors ${
                sleepQuality === quality
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-surface-hover text-text-main border-border-main hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!hoursSlept || !sleepQuality}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          hoursSlept && sleepQuality
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-200 dark:bg-gray-700 text-text-muted cursor-not-allowed'
        }`}
      >
        {t('sleep.saveButton')}
      </button>
    </div>
  )
}

export default SleepTracker
