import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'

function ExerciseGraph() {
  const { exerciseEntries } = useHealthData()

  const weeklyData = useMemo(() => {
    const days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

      const dayExercises = (exerciseEntries || []).filter(entry => entry.date === dateStr)
      const totalDuration = dayExercises.reduce((sum, entry) => sum + entry.duration, 0)

      days.push({
        day: dayName,
        totalDuration: totalDuration,
      })
    }

    return days
  }, [exerciseEntries])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Last 7 Days – Exercise Duration</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="day" className="text-gray-600 dark:text-gray-400" />
          <YAxis className="text-gray-600 dark:text-gray-400" />
          <Tooltip cursor={{ fill: 'rgba(156, 163, 175, 0.2)' }} wrapperClassName="dark:!bg-gray-800 dark:!text-gray-100 dark:!border-gray-700" />
          <Bar dataKey="totalDuration" className="fill-green-500 dark:fill-green-400" name="Duration (min)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExerciseGraph
