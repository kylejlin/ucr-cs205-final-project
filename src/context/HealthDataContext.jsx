import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { loadData, saveData, saveFileHandleInfo, getFileHandleInfo } from '../utils/storage'
import { createFile, openFile, writeFile, readFile } from '../utils/fileOperations'

const HealthDataContext = createContext()

export function HealthDataProvider({ children }) {
  const [moodEntries, setMoodEntries] = useState([])
  const [exerciseEntries, setExerciseEntries] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [fileHandle, setFileHandle] = useState(null)
  const [fileStatus, setFileStatus] = useState('none') // 'none', 'saving', 'saved', 'error'
  const fileHandleRef = useRef(null)

  // Load data on startup
  useEffect(() => {
    async function initialize() {
      // Load from localStorage first
      const loaded = loadData()
      setMoodEntries(loaded.moodEntries)
      setExerciseEntries(loaded.exerciseEntries)
      setIsLoaded(true)

      // Try to set up file auto-save
      const handleInfo = getFileHandleInfo()
      if (handleInfo && 'showOpenFilePicker' in window) {
        const handle = await openFile()
        if (handle) {
          fileHandleRef.current = handle
          setFileHandle(handle)

          // Load data from file if it's newer
          const fileData = await readFile(handle)
          if (fileData) {
            const fileDate = fileData.lastSaved ? new Date(fileData.lastSaved) : null
            let maxId = 0;
            if (loaded.moodEntries?.length > 0) maxId = Math.max(maxId, ...loaded.moodEntries.map(e => e.id));
            if (loaded.exerciseEntries?.length > 0) maxId = Math.max(maxId, ...loaded.exerciseEntries.map(e => e.id));
            const storageDate = maxId > 0 ? new Date(maxId) : null;
            if (!storageDate || (fileDate && fileDate > storageDate)) {
              if (fileData.moodEntries) setMoodEntries(fileData.moodEntries)
              if (fileData.exerciseEntries) setExerciseEntries(fileData.exerciseEntries)
              saveData(fileData.moodEntries || [], fileData.exerciseEntries || [])
            }
          }
        }
      } else {
        // Auto-setup file on first use
        const handle = await createFile()
        if (handle) {
          fileHandleRef.current = handle
          setFileHandle(handle)
          saveFileHandleInfo(handle)
          await writeFile(handle, {
            moodEntries: loaded.moodEntries,
            exerciseEntries: loaded.exerciseEntries,
            lastSaved: new Date().toISOString()
          })
        }
      }
    }

    initialize()
  }, [])

  // Auto-save to localStorage and file when data changes
  useEffect(() => {
    if (isLoaded) {
      saveData(moodEntries, exerciseEntries)
      saveToFile()
    }
  }, [moodEntries, exerciseEntries, isLoaded])

  async function saveToFile() {
    const handle = fileHandleRef.current
    if (!handle) return

    setFileStatus('saving')
    const success = await writeFile(handle, {
      moodEntries,
      exerciseEntries,
      lastSaved: new Date().toISOString()
    })

    if (success) {
      setFileStatus('saved')
      setTimeout(() => setFileStatus('none'), 2000)
    } else {
      setFileStatus('error')
      setTimeout(() => setFileStatus('none'), 3000)
    }
  }

  async function setupFileHandle() {
    const handle = await createFile()
    if (handle) {
      fileHandleRef.current = handle
      setFileHandle(handle)
      saveFileHandleInfo(handle)
      await saveToFile()
      return true
    }
    return false
  }

  async function loadFromFile() {
    const handle = await openFile()
    if (handle) {
      fileHandleRef.current = handle
      setFileHandle(handle)
      saveFileHandleInfo(handle)

      const data = await readFile(handle)
      if (data) {
        if (data.moodEntries) setMoodEntries(data.moodEntries)
        if (data.exerciseEntries) setExerciseEntries(data.exerciseEntries)
        saveData(data.moodEntries || [], data.exerciseEntries || [])
        return true
      }
    }
    return false
  }

  const addMoodEntry = (entry) => {
    setMoodEntries([...moodEntries, entry])
  }

  const deleteMoodEntry = (id) => {
    setMoodEntries(moodEntries.filter(entry => entry.id !== id))
  }

  const addExerciseEntry = (entry) => {
    setExerciseEntries([...exerciseEntries, entry])
  }

  const deleteExerciseEntry = (id) => {
    setExerciseEntries(exerciseEntries.filter(entry => entry.id !== id))
  }

  const setAllData = (data) => {
    if (data.moodEntries) setMoodEntries(data.moodEntries)
    if (data.exerciseEntries) setExerciseEntries(data.exerciseEntries)
  }

  const exportData = () => {
    const data = {
      moodEntries,
      exerciseEntries,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      let moodValid = true;
      let exerciseValid = true;

      if (data.moodEntries && Array.isArray(data.moodEntries)) {
        moodValid = data.moodEntries.every(entry =>
          entry.id &&
          typeof entry.mood === 'number' &&
          entry.timestamp &&
          entry.time &&
          entry.date &&
          (entry.note === undefined || typeof entry.note === 'string')
        )
      }

      if (data.exerciseEntries && Array.isArray(data.exerciseEntries)) {
        exerciseValid = data.exerciseEntries.every(entry =>
          entry.id &&
          typeof entry.type === 'string' &&
          typeof entry.duration === 'number' &&
          entry.timestamp &&
          entry.time &&
          entry.date
        )
      }

      if (moodValid && exerciseValid && (data.moodEntries || data.exerciseEntries)) {
        setAllData(data)
        return true
      }
      return false
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  return (
    <HealthDataContext.Provider
      value={{
        moodEntries,
        exerciseEntries,
        addMoodEntry,
        deleteMoodEntry,
        addExerciseEntry,
        deleteExerciseEntry,
        exportData,
        importData,
        setAllData,
        setupFileHandle,
        loadFromFile,
        fileHandle,
        fileStatus,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  )
}

export function useHealthData() {
  const context = useContext(HealthDataContext)
  if (!context) {
    throw new Error('useHealthData must be used within HealthDataProvider')
  }
  return context
}
