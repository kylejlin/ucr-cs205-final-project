import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'

function CalorieGraph() {
  const { t, i18n } = useTranslation()
  const { foodEntries } = useHealthData()

  const weeklyData = useMemo(() => {
    const days = []
    const today = new Date()
    const localeString = i18n.language === 'ja' ? 'ja-JP' : 'en-US'

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
      const dayName = date.toLocaleDateString(localeString, { weekday: 'short' })

      const dayFoods = (foodEntries || []).filter(entry => entry.date === dateStr)
      const totalCalories = dayFoods.reduce((sum, entry) => sum + (entry.calories || 0), 0)

      days.push({
        day: dayName,
        totalCalories: totalCalories,
      })
    }

    return days
  }, [foodEntries, i18n.language])

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-text-main mb-4">{t('calorieGraph.title')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border-main" />
          <XAxis dataKey="day" className="text-text-muted" />
          <YAxis className="text-text-muted" />
          <Tooltip cursor={{ fill: 'rgba(156, 163, 175, 0.2)' }} wrapperClassName="!bg-surface !text-text-main !border-border-main" />
          <Bar dataKey="totalCalories" className="fill-accent" name={t('calorieGraph.yAxisLabel')} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CalorieGraph
