const STORAGE_KEY = 'healthTrackingData'
const FILE_HANDLE_KEY = 'healthTrackingFileHandle'

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        moodEntries: data.moodEntries || [],
        exerciseEntries: data.exerciseEntries || [],
        foodEntries: data.foodEntries || [],
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
  return {
    moodEntries: [],
    exerciseEntries: [],
    foodEntries: [],
  }
}

export function saveData(moodEntries, exerciseEntries = [], foodEntries = []) {
  try {
    const data = { moodEntries, exerciseEntries, foodEntries }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export function saveFileHandleInfo(fileHandle) {
  const info = { name: fileHandle.name, kind: fileHandle.kind }
  localStorage.setItem(FILE_HANDLE_KEY, JSON.stringify(info))
}

export function getFileHandleInfo() {
  try {
    const stored = localStorage.getItem(FILE_HANDLE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    return null
  }
}
