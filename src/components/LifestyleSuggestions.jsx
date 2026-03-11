import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHealthData } from '../context/HealthDataContext';

export default function LifestyleSuggestions() {
  const { t } = useTranslation();
  const { moodEntries, exerciseEntries, foodEntries } = useHealthData();

  const suggestionData = useMemo(() => {
    if (!moodEntries || moodEntries.length === 0) return null;

    // Sort to find the most recent
    const sortedMoods = [...moodEntries].sort((a, b) => {
      const dateA = new Date(a.timestamp || a.date);
      const dateB = new Date(b.timestamp || b.date);
      return dateB - dateA;
    });
    
    const latestMood = sortedMoods[0];

    // Check if mood is poor (1 or 2)
    if (latestMood.mood > 2) return null;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Filter last 7 days data
    const recentExercise = exerciseEntries.filter(e => new Date(e.timestamp || e.date) >= sevenDaysAgo);
    const recentFood = foodEntries.filter(e => new Date(e.timestamp || e.date) >= sevenDaysAgo);

    const suggestions = [];

    if (recentExercise.length < 3 && recentFood.length < 3) {
      suggestions.push(t('suggestions.generic'));
    } else {
      let addedSpecific = false;

      // Exercise logic
      if (recentExercise.length >= 3) {
        let totalDuration = 0;
        recentExercise.forEach(e => {
          totalDuration += (Number(e.duration) || 0);
        });
        // Group by date to find number of days with data
        const uniqueDays = new Set(recentExercise.map(e => e.date)).size || 1;
        const avgDuration = totalDuration / uniqueDays;

        if (avgDuration < 30) {
          suggestions.push(t('suggestions.exerciseMore'));
          addedSpecific = true;
        } else if (avgDuration > 90) {
          suggestions.push(t('suggestions.exerciseLess'));
          addedSpecific = true;
        }
      }

      // Food logic
      if (recentFood.length >= 3) {
        let totalCalories = 0;
        recentFood.forEach(e => {
          totalCalories += (Number(e.calories) || 0);
        });
        // Group by date to find number of days with data
        const uniqueDays = new Set(recentFood.map(e => e.date)).size || 1;
        const avgCalories = totalCalories / uniqueDays;

        if (avgCalories > 0 && avgCalories < 1500) {
          suggestions.push(t('suggestions.eatMore'));
          addedSpecific = true;
        } else if (avgCalories > 3000) {
          suggestions.push(t('suggestions.eatLess'));
          addedSpecific = true;
        }
      }

      // If they are in the "good" range for both, let's just show generic
      if (!addedSpecific) {
        suggestions.push(t('suggestions.generic'));
      }
    }

    return suggestions;
  }, [moodEntries, exerciseEntries, foodEntries, t]);

  if (!suggestionData || suggestionData.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-xl shadow-lg p-6 transition-colors border border-accent border-l-4 border-l-accent">
      <h2 className="text-xl font-semibold mb-4 text-text-main flex items-center gap-2">
        <span role="img" aria-label="lightbulb">💡</span>
        {t('suggestions.title')}
      </h2>
      <ul className="space-y-3 mb-6">
        {suggestionData.map((suggestion, index) => (
          <li key={index} className="text-text-main leading-relaxed bg-surface-hover p-4 rounded-lg">
            {suggestion}
          </li>
        ))}
      </ul>
      <div className="border-t border-border-main pt-3 mt-4">
        <p className="text-xs text-text-muted italic text-center">
          {t('suggestions.disclaimer')}
        </p>
      </div>
    </div>
  );
}
