import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'

function WeeklyGraph() {
  const { t, i18n } = useTranslation()
  const { moodEntries } = useHealthData()

  const weeklyData = useMemo(() => {
    const days = []
    const today = new Date()
    const localeString = i18n.language === 'ja' ? 'ja-JP' : 'en-US'

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
      const dayName = date.toLocaleDateString(localeString, { weekday: 'short' })

      const dayMoods = moodEntries.filter(entry => entry.date === dateStr)
      const avgMood =
        dayMoods.length === 0
          ? 0
          : dayMoods.reduce((sum, entry) => sum + entry.mood, 0) / dayMoods.length

      days.push({
        day: dayName,
        averageMood: Number(avgMood.toFixed(2)),
      })
    }

    return days
  }, [moodEntries, i18n.language])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('weeklyGraph.title')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="day" className="text-gray-600 dark:text-gray-400" />
          <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} className="text-gray-600 dark:text-gray-400" />
          <Tooltip cursor={{ fill: 'rgba(156, 163, 175, 0.2)' }} wrapperClassName="dark:!bg-gray-800 dark:!text-gray-100 dark:!border-gray-700" />
          <Bar dataKey="averageMood" className="fill-indigo-500 dark:fill-purple-400" name={t('weeklyGraph.yAxisLabel')} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeeklyGraph
