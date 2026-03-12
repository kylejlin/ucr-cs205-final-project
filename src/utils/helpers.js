export function getTodayFormatted() {
  const today = new Date()
  return today.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

export function calculateStreak(mood, food, exercise, sleep) {
  const allEntries = [
    ...(mood || []),
    ...(food || []),
    ...(exercise || []),
    ...(sleep || [])
  ];

  if (allEntries.length === 0) return 0;

  const uniqueDates = [...new Set(allEntries.map(entry => {
    const d = new Date(entry.timestamp || entry.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }))].sort((a, b) => b.localeCompare(a)); 

  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  let currentDateObj;
  
  if (uniqueDates[0] === todayStr) {
    currentDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  } else if (uniqueDates[0] === yesterdayStr) {
    currentDateObj = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  } else {
    return 0;
  }

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedStr = `${currentDateObj.getFullYear()}-${String(currentDateObj.getMonth() + 1).padStart(2, '0')}-${String(currentDateObj.getDate()).padStart(2, '0')}`;
    
    if (uniqueDates[i] === expectedStr) {
      streak++;
      currentDateObj.setDate(currentDateObj.getDate() - 1); 
    } else {
      break;
    }
  }

  return streak;
}
