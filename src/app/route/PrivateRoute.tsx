import { useUserStore } from 'app/user/UserProvider'
import React from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

function PrivateRoute({ children }: Props) {
  const { user } = useUserStore()

  if (!user?.id) {
    return <Navigate to='/login' />
  }

  return <>{children}</>
}

export default PrivateRoute
