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
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-text-main mb-4">
        {t('food.title')}
      </h2>
      <p className="text-text-muted mb-4">
        {t('food.description')}
      </p>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">
            {t('food.mealTypeLabel')}
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-border-main rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-main"
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
            <label className="block text-sm font-medium text-text-main mb-1">
              {t('food.foodNameLabel')}
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder={t('food.foodNamePlaceholder')}
              className="w-full px-4 py-2 border border-border-main rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-main"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-main mb-1">
              {t('food.caloriesLabel')}
            </label>
            <input
              type="number"
              min="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder={t('food.caloriesPlaceholder')}
              className="w-full px-4 py-2 border border-border-main rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-main"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!foodName.trim()}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${foodName.trim()
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-gray-200  text-text-muted cursor-not-allowed'
            }`}
        >
          {t('food.saveButton')}
        </button>
      </form>

      {latestEntry && (
        <div className="mb-6 p-4 bg-surface border border-accent rounded-lg">
          <p className="text-sm text-text-muted mb-1">{t('food.lastLogged')}</p>
          <p className="text-lg font-semibold text-accent">
            {t(`food.mealTypes.${latestEntry.mealType}`)} – {latestEntry.foodName}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {latestEntry.date} {t('common.at')} {latestEntry.time} {latestEntry.calories ? `• ${latestEntry.calories} ${t('food.kcal')}` : ''}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {!foodEntries || foodEntries.length === 0 ? (
          <p className="text-text-muted text-center py-4">
            {t('food.noFoods')}
          </p>
        ) : (
          [...foodEntries]
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 bg-surface-hover rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div>
                  <span className="font-medium text-text-main">
                    {t(`food.mealTypes.${entry.mealType}`)}
                  </span>
                  <span className="text-text-main ml-2">
                    {entry.foodName}
                  </span>
                  {entry.calories && (
                    <span className="text-text-muted text-sm ml-2">
                      | {entry.calories} {t('food.kcal')}
                    </span>
                  )}
                  <span className="text-text-muted text-sm ml-2">
                    • {entry.date}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(t('food.deleteConfirm'))) {
                      deleteFoodEntry(entry.id)
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

export default FoodTracker
