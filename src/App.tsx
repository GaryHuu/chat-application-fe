import { LinearProgress } from '@mui/material'
import { Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { initDB as initRequestTrackingDB } from 'services/requestTrackingDB'
import { routes } from 'ui/pages/routes'

function App() {
  const element = useRoutes(routes)

  useEffect(() => {
    // Test deploy
    initRequestTrackingDB()
  }, [])

  return <Suspense fallback={<LinearProgress />}>{element}</Suspense>
}

export default App
