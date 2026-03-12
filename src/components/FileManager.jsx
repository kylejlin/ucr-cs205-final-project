import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHealthData } from '../context/HealthDataContext'

function FileManager() {
  const { t } = useTranslation();
  const { exportData, importData, setupFileHandle, loadFromFile, fileHandle, fileStatus } = useHealthData()
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (fileStatus === 'saved') {
      setTimeout(() => setImportSuccess(false), 2000)
    }
  }, [fileStatus])

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-tracking-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target.result
        setImportText(content)
        handleImport(content)
      }
      reader.readAsText(file)
    }
  }

  const handleImport = (jsonString = importText) => {
    setImportError('')
    setImportSuccess(false)

    if (!jsonString.trim()) {
      setImportError(t('dataManager.errorNoData'))
      return
    }

    const success = importData(jsonString)
    if (success) {
      setImportSuccess(true)
      setImportText('')
      setTimeout(() => setImportSuccess(false), 3000)
    } else {
      setImportError(t('dataManager.errorInvalidData'))
    }
  }

  const handleClear = () => {
    if (window.confirm(t('dataManager.clearConfirm'))) {
      importData(JSON.stringify({ moodEntries: [], exerciseEntries: [], foodEntries: [] }))
      setImportText('')
      setImportSuccess(true)
      setTimeout(() => setImportSuccess(false), 3000)
    }
  }

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-text-main mb-4">
        {t('dataManager.title')}
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-text-main mb-2">{t('dataManager.autoSaveTitle')}</h3>
          <p className="text-sm text-text-muted mb-3">
            {t('dataManager.autoSaveDesc')}
          </p>
          {fileHandle ? (
            <div className="mb-3 p-3 bg-surface border border-accent border border-green-300 rounded-lg">
              <p className="text-sm text-accent">
                <strong>{t('dataManager.autoSaveEnabled')}</strong> {fileHandle.name || t('dataManager.fileSelected')}
              </p>
              {fileStatus === 'saving' && (
                <p className="text-xs text-green-600 mt-1">{t('dataManager.saving')}</p>
              )}
              {fileStatus === 'saved' && (
                <p className="text-xs text-green-600 mt-1">{t('dataManager.savedSuccess')}</p>
              )}
              {fileStatus === 'error' && (
                <p className="text-xs text-red-600 mt-1">{t('dataManager.saveError')}</p>
              )}
            </div>
          ) : (
            <div className="mb-3 p-3 bg-surface border border-accent border border-blue-300 rounded-lg">
              <p className="text-sm text-blue-600">
                {t('dataManager.noFileDesc')}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={async () => {
                const success = await setupFileHandle()
                if (success) {
                  setImportSuccess(true)
                  setTimeout(() => setImportSuccess(false), 3000)
                }
              }}
              className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors font-medium"
            >
              {fileHandle ? t('dataManager.changeFileBtn') : t('dataManager.setupFileBtn')}
            </button>
            <button
              onClick={async () => {
                const success = await loadFromFile()
                if (success) {
                  setImportSuccess(true)
                  setTimeout(() => setImportSuccess(false), 3000)
                }
              }}
              className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors font-medium"
            >
              {t('dataManager.loadFromFileBtn')}
            </button>
          </div>
        </div>

        <div className="border-t border-border-main pt-4">
          <h3 className="text-lg font-medium text-text-main mb-2">{t('dataManager.manualExportTitle')}</h3>
          <p className="text-sm text-text-muted mb-3">
            {t('dataManager.manualExportDesc')}
          </p>
          <button
            onClick={handleExport}
            className="w-full bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors font-medium"
          >
            {t('dataManager.exportBtn')}
          </button>
        </div>

        <div className="border-t border-border-main pt-4">
          <h3 className="text-lg font-medium text-text-main mb-2">{t('dataManager.importTitle')}</h3>
          <p className="text-sm text-text-muted mb-3">
            {t('dataManager.importDesc')}
          </p>

          <div className="mb-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-surface-hover text-white py-2 px-4 rounded-lg hover:bg-border-main transition-colors font-medium mb-2"
            >
              {t('dataManager.selectFileBtn')}
            </button>
          </div>

          <div className="mb-3">
            <label htmlFor="importText" className="block text-sm font-medium text-text-main mb-1">
              {t('dataManager.pasteJsonLabel')}
            </label>
            <textarea
              id="importText"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"moodEntries": [...], "exerciseEntries": [...], "foodEntries": [...] }'
              className="w-full px-4 py-2 border border-border-main rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent font-mono text-sm bg-surface text-text-main"
              rows="8"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleImport()}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors font-medium"
            >
              {t('dataManager.importBtn')}
            </button>
            <button
              onClick={handleClear}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {t('dataManager.clearDataBtn')}
            </button>
          </div>

          {importError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-600">{importError}</p>
            </div>
          )}

          {importSuccess && (
            <div className="mt-2 p-3 bg-surface border border-accent border border-green-300 rounded-lg">
              <p className="text-sm text-green-600">{t('dataManager.importSuccess')}</p>
            </div>
          )}
        </div>

        <div className="border-t border-border-main pt-4">
          <h3 className="text-lg font-medium text-text-main mb-2">{t('dataManager.formatTitle')}</h3>
          <p className="text-xs text-text-muted mb-2">
            {t('dataManager.formatDesc')}
          </p>
          <pre className="bg-surface-hover text-text-main p-3 rounded text-xs overflow-x-auto border border-border-main">
            {`{
  "moodEntries": [
    {
      "id": 1234567890,
      "mood": 4,
      "note": "Feeling pretty good today!",
      "timestamp": "2024-01-15T12:00:00.000Z",
      "time": "12:00 PM",
      "date": "1/15/2024"
    }
  ],
  "exerciseEntries": [
    {
      "id": 1234567891,
      "type": "Running",
      "duration": 30,
      "calories": 300,
      "timestamp": "2024-01-15T14:00:00.000Z",
      "time": "2:00 PM",
      "date": "1/15/2024"
    }
  ],
  "foodEntries": [
    {
      "id": 1234567892,
      "mealType": "Lunch",
      "foodName": "Salad",
      "calories": 250,
      "timestamp": "2024-01-15T12:30:00.000Z",
      "time": "12:30 PM",
      "date": "1/15/2024"
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default FileManager
