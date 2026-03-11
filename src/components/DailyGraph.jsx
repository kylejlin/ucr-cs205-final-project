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
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-text-main mb-2">{t('dailyGraph.title')}</h3>
      <p className="text-sm text-text-muted mb-4">{todayStr}</p>
      {!hasTodayData && (
        <div className="mb-4 p-3 bg-surface border border-accent border border-accent rounded-lg">
          <p className="text-sm text-accent">
            {t('dailyGraph.noData')}
          </p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border-main" />
          <XAxis dataKey="time" className="text-text-muted" />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} className="text-text-muted" />
          <Tooltip wrapperClassName="!bg-surface !text-text-main !border-border-main" />
          <Line type="monotone" dataKey="mood" className="stroke-accent" fill="none" strokeWidth={2} name={t('dailyGraph.yAxisLabel')} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DailyGraph
