import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserStore } from '../user/UserProvider'

type Props = {
  children: React.ReactNode
}

function PrivateRoute({ children }: Props) {
  const { user } = useUserStore()

  if (!user) {
    return <Navigate to='/login' />
  }

  return <>{children}</>
}

export default PrivateRoute
