import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'
function MoodTracker() {
  const { t } = useTranslation();
  const { moodEntries, addMoodEntry, deleteMoodEntry } = useHealthData()

  const MOOD_LABELS = {
    1: t('mood.labels.1'),
    2: t('mood.labels.2'),
    3: t('mood.labels.3'),
    4: t('mood.labels.4'),
    5: t('mood.labels.5'),
  }
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')

  const handleSelectMood = (mood) => {
    setSelectedMood(mood)
  }

  const handleSubmit = () => {
    if (!selectedMood) return

    const now = new Date()

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: note.trim(),
      timestamp: now.toISOString(),
      date: getTodayFormatted(),
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }

    addMoodEntry(newEntry)
    setSelectedMood(null)
    setNote('')
  }

  const latestEntry = moodEntries.length > 0
    ? [...moodEntries].sort((a, b) => b.id - a.id)[0]
    : null

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-text-main mb-4">
        {t('mood.title')}
      </h2>
      <p className="text-text-muted mb-4">
        {t('mood.description')}
      </p>

      <div className="flex flex-wrap sm:flex-nowrap justify-between gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((mood) => (
          <button
            key={mood}
            onClick={() => handleSelectMood(mood)}
            className={`flex-1 min-w-[3.5rem] p-2 sm:py-3 rounded-lg font-semibold border transition-colors ${selectedMood === mood
              ? 'bg-accent text-white border-accent'
              : 'bg-surface-hover text-text-main border-border-main hover:bg-gray-100 '
              }`}
          >
            <div className="text-lg">{mood}</div>
            <div
              className={`text-xs mt-1 ${selectedMood === mood ? 'text-white' : 'text-text-muted'
                }`}
            >
              {MOOD_LABELS[mood]}
            </div>
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t('mood.notePlaceholder')}
        className="w-full p-3 mb-6 border rounded-lg bg-surface-hover text-text-main border-border-main focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-colors resize-y"
        rows="3"
      />

      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className={`w-full mb-6 py-2 px-4 rounded-lg font-medium transition-colors ${selectedMood
          ? 'bg-accent text-white hover:bg-accent-hover'
          : 'bg-gray-200  text-text-muted cursor-not-allowed'
          }`}
      >
        {t('mood.saveButton')}
      </button>

      {latestEntry && (
        <div className="mb-6 p-4 bg-surface-hover rounded-lg">
          <p className="text-sm text-text-muted mb-1">{t('mood.lastRecorded')}</p>
          <p className="text-lg font-semibold text-accent">
            {latestEntry.mood} – {MOOD_LABELS[latestEntry.mood] || t('mood.moodLabel')}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {latestEntry.date} {t('common.at')} {latestEntry.time}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {moodEntries.length === 0 ? (
          <p className="text-text-muted text-center py-4">
            {t('mood.noMoods')}
          </p>
        ) : (
          [...moodEntries]
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 bg-surface-hover rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div>
                  <span className="font-medium text-text-main">
                    {entry.mood} – {MOOD_LABELS[entry.mood] || t('mood.moodLabel')}
                  </span>
                  <span className="text-text-muted text-sm ml-2">
                    • {entry.date} {t('common.at')} {entry.time}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(t('mood.deleteConfirm'))) {
                      deleteMoodEntry(entry.id)
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

export default MoodTracker

