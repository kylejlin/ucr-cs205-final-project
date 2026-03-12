import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHealthData } from '../context/HealthDataContext'

function HistoryView() {
  const { t } = useTranslation();
  const { moodEntries, exerciseEntries, foodEntries, sleepEntries, deleteMoodEntry, deleteExerciseEntry, deleteFoodEntry, deleteSleepEntry } = useHealthData()

  const sortedEntries = useMemo(() => {
    const allEntries = [
      ...moodEntries.map(e => ({ ...e, entryType: 'mood' })),
      ...(exerciseEntries || []).map(e => ({ ...e, entryType: 'exercise' })),
      ...(foodEntries || []).map(e => ({ ...e, entryType: 'food' })),
      ...(sleepEntries || []).map(e => ({ ...e, entryType: 'sleep' }))
    ]
    return allEntries.sort((a, b) => b.id - a.id)
  }, [moodEntries, exerciseEntries, foodEntries, sleepEntries])

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

  const getEntryStyle = (entry) => {
    if (entry.entryType === 'exercise') {
      return "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 text-blue-900 dark:text-blue-200"
    }
    if (entry.entryType === 'food') {
      return "bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 text-amber-900 dark:text-amber-200"
    }
    if (entry.entryType === 'sleep') {
      return "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200"
    }
    if (entry.entryType === 'mood') {
      switch(entry.mood) {
        case 1: return "bg-rose-50 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 text-rose-900 dark:text-rose-200";
        case 2: return "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800 text-orange-900 dark:text-orange-200";
        case 3: return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200";
        case 4: return "bg-lime-50 border-lime-200 dark:bg-lime-900/30 dark:border-lime-800 text-lime-900 dark:text-lime-200";
        case 5: return "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200";
        default: return "bg-surface-hover border-border-main text-text-main";
      }
    }
    return "bg-surface-hover border-border-main text-text-main"
  }

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
                      className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${getEntryStyle(entry)}`}
                    >
                      <div className="flex-1">
                        {entry.entryType === 'mood' ? (
                          <>
                            <span className="font-medium text-inherit">
                              🧠 {t('history.moodLabel')}: {entry.mood} – {t(`mood.labels.${entry.mood}`)}
                            </span>
                            <span className="text-inherit opacity-80 text-sm ml-2">
                              • {entry.time}
                            </span>
                            {entry.note && (
                              <p className="text-sm mt-2 text-inherit bg-white/50 dark:bg-black/20 p-2 rounded border border-current shadow-sm">
                                {entry.note}
                              </p>
                            )}
                          </>
                        ) : entry.entryType === 'exercise' ? (
                          <>
                            <span className="font-medium text-inherit">
                              🏃 {t('history.exerciseLabel')}: {t(`exercise.types.${entry.type}`)} ({entry.duration} {t('exercise.min')})
                            </span>
                            {entry.calories && (
                              <span className="text-inherit opacity-80 text-sm ml-2">
                                | {entry.calories} {t('exercise.kcal')}
                              </span>
                            )}
                            <span className="text-inherit opacity-80 text-sm ml-2">
                              • {entry.time}
                            </span>
                          </>
                        ) : entry.entryType === 'food' ? (
                          <>
                            <span className="font-medium text-inherit">
                              🍎 {t('history.foodLabel')}: {t(`food.mealTypes.${entry.mealType}`)} - {entry.foodName}
                            </span>
                            {entry.calories && (
                              <span className="text-inherit opacity-80 text-sm ml-2">
                                | {entry.calories} {t('food.kcal')}
                              </span>
                            )}
                            <span className="text-inherit opacity-80 text-sm ml-2">
                              • {entry.time}
                            </span>
                          </>
                        ) : entry.entryType === 'sleep' ? (
                          <>
                            <span className="font-medium text-inherit">
                              🌙 {t('history.sleepLabel')}: {entry.hoursSlept} {t('sleep.hoursSlept')}
                            </span>
                            <span className="text-inherit opacity-80 text-sm ml-2">
                              | {t('sleep.qualityLabel')}: {entry.sleepQuality}/5
                            </span>
                            <span className="text-inherit opacity-80 text-sm ml-2">
                              • {entry.time}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <button
                        onClick={() => {
                          if (entry.entryType === 'mood') {
                            if (window.confirm(t('mood.deleteConfirm'))) deleteMoodEntry(entry.id)
                          } else if (entry.entryType === 'exercise') {
                            if (window.confirm(t('exercise.deleteConfirm'))) deleteExerciseEntry(entry.id)
                          } else if (entry.entryType === 'food') {
                            if (window.confirm(t('food.deleteConfirm'))) deleteFoodEntry(entry.id)
                          } else if (entry.entryType === 'sleep') {
                            if (window.confirm(t('sleep.deleteConfirm'))) deleteSleepEntry(entry.id)
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
