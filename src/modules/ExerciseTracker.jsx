import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'

const EXERCISE_TYPES = [
  'Running',
  'Walking',
  'Cycling',
  'Weightlifting',
  'Yoga',
  'Swimming',
  'Other'
]

function ExerciseTracker() {
  const { t } = useTranslation();
  const { exerciseEntries, addExerciseEntry, deleteExerciseEntry } = useHealthData()
  const [selectedType, setSelectedType] = useState(EXERCISE_TYPES[0])
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!duration || isNaN(duration) || Number(duration) <= 0) return

    const now = new Date()

    const newEntry = {
      id: Date.now(),
      type: selectedType,
      duration: Number(duration),
      calories: calories && !isNaN(calories) ? Number(calories) : null,
      timestamp: now.toISOString(),
      date: getTodayFormatted(),
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }

    addExerciseEntry(newEntry)
    setDuration('')
    setCalories('')
    setSelectedType(EXERCISE_TYPES[0])
  }

  const latestEntry = exerciseEntries?.length > 0
    ? [...exerciseEntries].sort((a, b) => b.id - a.id)[0]
    : null

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-text-main mb-4">
        {t('exercise.title')}
      </h2>
      <p className="text-text-muted mb-4">
        {t('exercise.description')}
      </p>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            {t('exercise.typeLabel')}
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-border-main rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-main"
          >
            {EXERCISE_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`exercise.types.${type}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-main mb-1">
              {t('exercise.durationLabel')}
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder={t('exercise.durationPlaceholder')}
              className="w-full px-4 py-2 border border-border-main rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-main"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-main mb-1">
              {t('exercise.caloriesLabel')}
            </label>
            <input
              type="number"
              min="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder={t('exercise.caloriesPlaceholder')}
              className="w-full px-4 py-2 border border-border-main rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-main"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!duration}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${duration
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-gray-200  text-text-muted cursor-not-allowed'
            }`}
        >
          {t('exercise.saveButton')}
        </button>
      </form>

      {latestEntry && (
        <div className="mb-6 p-4 bg-surface border border-accent rounded-lg">
          <p className="text-sm text-text-muted mb-1">{t('exercise.lastLogged')}</p>
          <p className="text-lg font-semibold text-accent">
            {t(`exercise.types.${latestEntry.type}`)} – {latestEntry.duration} {t('exercise.min')}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {latestEntry.date} {t('common.at')} {latestEntry.time} {latestEntry.calories ? `• ${latestEntry.calories} ${t('exercise.kcal')}` : ''}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {!exerciseEntries || exerciseEntries.length === 0 ? (
          <p className="text-text-muted text-center py-4">
            {t('exercise.noWorkouts')}
          </p>
        ) : (
          [...exerciseEntries]
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-3 bg-surface-hover rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div>
                  <span className="font-medium text-text-main">
                    {t(`exercise.types.${entry.type}`)} ({entry.duration} {t('exercise.min')})
                  </span>
                  {entry.calories && (
                    <span className="text-text-muted text-sm ml-2">
                      | {entry.calories} {t('exercise.kcal')}
                    </span>
                  )}
                  <span className="text-text-muted text-sm ml-2">
                    • {entry.date}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(t('exercise.deleteConfirm'))) {
                      deleteExerciseEntry(entry.id)
                    }
                  }}
                  className="text-red-500 hover:text-red-600 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  title={t('common.delete')}
                >
                  {t('common.delete')}
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

export default ExerciseTracker
