import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import LoadingProgress from 'ui/components/Base/LoadingProgress'
import { routes } from 'ui/pages/routes'

function App() {
  const element = useRoutes(routes)
  return <Suspense fallback={<LoadingProgress />}>{element}</Suspense>
}

export default App
