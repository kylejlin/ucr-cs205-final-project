import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'

const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack'
]

function FoodTracker() {
  const { t } = useTranslation();
  const { foodEntries, addFoodEntry, deleteFoodEntry } = useHealthData()
  const [selectedType, setSelectedType] = useState(MEAL_TYPES[0])
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!foodName.trim()) return

    const now = new Date()

    const newEntry = {
      id: Date.now(),
      mealType: selectedType,
      foodName: foodName.trim(),
      calories: calories && !isNaN(calories) ? Number(calories) : null,
      timestamp: now.toISOString(),
      date: getTodayFormatted(),
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }

    addFoodEntry(newEntry)
    setFoodName('')
    setCalories('')
    setSelectedType(MEAL_TYPES[0])
  }

  const latestEntry = foodEntries?.length > 0
    ? [...foodEntries].sort((a, b) => b.id - a.id)[0]
    : null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {t('food.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {t('food.description')}
      </p>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('food.mealTypeLabel')}
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {MEAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`food.mealTypes.${type}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('food.foodNameLabel')}
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder={t('food.foodNamePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('food.caloriesLabel')}
            </label>
            <input
              type="number"
              min="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder={t('food.caloriesPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!foodName.trim()}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${foodName.trim()
              ? 'bg-orange-600 dark:bg-orange-500 text-white hover:bg-orange-700 dark:hover:bg-orange-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
        >
          {t('food.saveButton')}
        </button>
      </form>

      {latestEntry && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('food.lastLogged')}</p>
          <p className="text-lg font-semibold text-orange-700 dark:text-orange-300">
            {t(`food.mealTypes.${latestEntry.mealType}`)} – {latestEntry.foodName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {latestEntry.date} {t('common.at')} {latestEntry.time} {latestEntry.calories ? `• ${latestEntry.calories} ${t('food.kcal')}` : ''}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {!foodEntries || foodEntries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            {t('food.noFoods')}
          </p>
        ) : (
          [...foodEntries]
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {t(`food.mealTypes.${entry.mealType}`)}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200 ml-2">
                    {entry.foodName}
                  </span>
                  {entry.calories && (
                    <span className="text-gray-600 dark:text-gray-300 text-sm ml-2">
                      | {entry.calories} {t('food.kcal')}
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                    • {entry.date}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(t('food.deleteConfirm'))) {
                      deleteFoodEntry(entry.id)
                    }
                  }}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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

export default FoodTracker
