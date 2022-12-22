import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from './UserProvider'

type Props = {
  children: React.ReactNode
}

function PrivateRoute({ children }: Props) {
  const { user } = useUserStore()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
