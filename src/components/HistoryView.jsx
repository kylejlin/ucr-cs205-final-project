import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHealthData } from '../context/HealthDataContext'

function HistoryView() {
  const { t } = useTranslation();
  const { moodEntries, exerciseEntries, foodEntries, deleteMoodEntry, deleteExerciseEntry, deleteFoodEntry } = useHealthData()

  const sortedEntries = useMemo(() => {
    const allEntries = [
      ...moodEntries.map(e => ({ ...e, entryType: 'mood' })),
      ...(exerciseEntries || []).map(e => ({ ...e, entryType: 'exercise' })),
      ...(foodEntries || []).map(e => ({ ...e, entryType: 'food' }))
    ]
    return allEntries.sort((a, b) => b.id - a.id)
  }, [moodEntries, exerciseEntries, foodEntries])

  const groupedByDate = useMemo(() => {
    const grouped = {}
    sortedEntries.forEach(entry => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = []
      }
      grouped[entry.date].push(entry)
    })
    return grouped
  }, [sortedEntries])

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-text-main mb-6">{t('history.title')}</h2>

      {Object.keys(groupedByDate).length === 0 ? (
        <p className="text-text-muted text-center py-8">
          {t('history.noHistory')}
        </p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([date, entries]) => (
              <div key={date} className="border-b border-border-main pb-4 last:border-b-0">
                <h3 className="text-lg font-semibold text-text-main mb-3">{date}</h3>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex justify-between items-center p-3 bg-surface-hover rounded-lg hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex-1">
                        {entry.entryType === 'mood' ? (
                          <>
                            <span className="font-medium text-text-main">
                              {t('history.moodLabel')}: {entry.mood} – {t(`mood.labels.${entry.mood}`)}
                            </span>
                            <span className="text-text-muted text-sm ml-2">
                              • {entry.time}
                            </span>
                            {entry.note && (
                              <p className="text-sm mt-2 text-text-main bg-surface p-2 rounded border border-border-main shadow-sm">
                                {entry.note}
                              </p>
                            )}
                          </>
                        ) : entry.entryType === 'exercise' ? (
                          <>
                            <span className="font-medium text-text-main">
                              {t('history.exerciseLabel')}: {t(`exercise.types.${entry.type}`)} ({entry.duration} {t('exercise.min')})
                            </span>
                            {entry.calories && (
                              <span className="text-text-muted text-sm ml-2">
                                | {entry.calories} {t('exercise.kcal')}
                              </span>
                            )}
                            <span className="text-text-muted text-sm ml-2">
                              • {entry.time}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-text-main">
                              {t('history.foodLabel')}: {t(`food.mealTypes.${entry.mealType}`)} - {entry.foodName}
                            </span>
                            {entry.calories && (
                              <span className="text-text-muted text-sm ml-2">
                                | {entry.calories} {t('food.kcal')}
                              </span>
                            )}
                            <span className="text-text-muted text-sm ml-2">
                              • {entry.time}
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (entry.entryType === 'mood') {
                            if (window.confirm(t('mood.deleteConfirm'))) deleteMoodEntry(entry.id)
                          } else if (entry.entryType === 'exercise') {
                            if (window.confirm(t('exercise.deleteConfirm'))) deleteExerciseEntry(entry.id)
                          } else {
                            if (window.confirm(t('food.deleteConfirm'))) deleteFoodEntry(entry.id)
                          }
                        }}
                        className="text-red-500 hover:text-red-600 font-medium text-sm ml-4 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        title={t('common.delete')}
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default HistoryView
