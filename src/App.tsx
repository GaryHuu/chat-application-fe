import { routes } from 'app/route'
import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import LoadingProgress from 'ui/components/base/LoadingProgress'

function App() {
  const element = useRoutes(routes)
  return <Suspense fallback={<LoadingProgress />}>{element}</Suspense>
}

export default App
