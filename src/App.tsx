import { LinearProgress } from '@mui/material'
import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from 'ui/pages/routes'

function App() {
  const element = useRoutes(routes)
  return <Suspense fallback={<LinearProgress />}>{element}</Suspense>
}

export default App
