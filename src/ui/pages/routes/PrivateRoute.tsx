import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserStorage } from 'services/storageAdapter'

type Props = {
  children: React.ReactNode
}

function PrivateRoute({ children }: Props) {
  const { user } = useUserStorage()

  if (!user?.id) {
    return <Navigate to='/login' />
  }

  return <>{children}</>
}

export default PrivateRoute
