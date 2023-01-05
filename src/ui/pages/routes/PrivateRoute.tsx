import useAuthenticate from 'app/useAuthenticate'
import React from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

function PrivateRoute({ children }: Props) {
  const { user } = useAuthenticate()

  if (!user?.id) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default PrivateRoute
