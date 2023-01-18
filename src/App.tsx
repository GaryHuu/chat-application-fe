import { LinearProgress } from '@mui/material'
import { trackingWorkerHandler } from 'app/trackingWorkerHandler'
import { Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { initDB as initRequestTrackingDB } from 'services/requestTrackingDB'
import { routes } from 'ui/pages/routes'

function App() {
  const element = useRoutes(routes)

  useEffect(() => {
    initRequestTrackingDB()
  }, [])

  useEffect(() => {
    const environment = process.env.NODE_ENV || 'development'
    if (['development', 'test'].includes(environment)) {
      trackingWorkerHandler()
    }
  }, [])

  return <Suspense fallback={<LinearProgress />}>{element}</Suspense>
}

export default App
