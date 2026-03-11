import { useState } from 'react'
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Exercise Tracker
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Log your workouts to keep track of your physical activity.
      </p>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Exercise Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {EXERCISE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (min)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 30"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Calories (optional)
            </label>
            <input
              type="number"
              min="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g. 250"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!duration}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${duration
              ? 'bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
        >
          Log Workout
        </button>
      </form>

      {latestEntry && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Last logged workout:</p>
          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
            {latestEntry.type} – {latestEntry.duration} min
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {latestEntry.date} at {latestEntry.time} {latestEntry.calories ? `• ${latestEntry.calories} kcal` : ''}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {!exerciseEntries || exerciseEntries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No workouts logged yet.
          </p>
        ) : (
          [...exerciseEntries]
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {entry.type} ({entry.duration} min)
                  </span>
                  {entry.calories && (
                    <span className="text-gray-600 dark:text-gray-300 text-sm ml-2">
                      | {entry.calories} kcal
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                    • {entry.date}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this exercise entry?')) {
                      deleteExerciseEntry(entry.id)
                    }
                  }}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete this entry"
                >
                  Delete
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

export default ExerciseTracker
