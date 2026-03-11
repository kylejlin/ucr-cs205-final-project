import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'

function DailyGraph() {
  const { t } = useTranslation();
  const { moodEntries } = useHealthData()

  const dailyData = useMemo(() => {
    const todayStr = getTodayFormatted()

    const todayMoods = moodEntries
      .filter(entry => entry.date === todayStr)
      .map(entry => ({
        time: entry.time,
        mood: entry.mood,
      }))

    if (todayMoods.length === 0) {
      return []
    }

    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ')
      const [hours, minutes] = time.split(':')
      let hour = parseInt(hours, 10)
      if (period === 'PM' && hour !== 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0
      return hour * 60 + parseInt(minutes || 0, 10)
    }

    return [...todayMoods].sort((a, b) => parseTime(a.time) - parseTime(b.time))
  }, [moodEntries])

  const todayStr = getTodayFormatted()
  const hasTodayData = dailyData.length > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('dailyGraph.title')}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{todayStr}</p>
      {!hasTodayData && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-200">
            {t('dailyGraph.noData')}
          </p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="time" className="text-gray-600 dark:text-gray-400" />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} className="text-gray-600 dark:text-gray-400" />
          <Tooltip wrapperClassName="dark:!bg-gray-800 dark:!text-gray-100 dark:!border-gray-700" />
          <Line type="monotone" dataKey="mood" className="stroke-indigo-500 dark:stroke-purple-400" fill="none" strokeWidth={2} name={t('dailyGraph.yAxisLabel')} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DailyGraph
