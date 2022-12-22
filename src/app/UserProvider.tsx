import { UserType } from 'domain/user'
import React, { useContext, useEffect, useState } from 'react'
import authApi from 'services/authApi'
import { ParamsFetchFriendsType, PayloadLoginType } from 'types/auth'
import { USER_STORAGE_KEY } from 'utils'
import useBoolean from 'hooks/useBoolean'

const getUserFromLocalStorage = (): UserType | null => {
  try {
    const value = localStorage.getItem(USER_STORAGE_KEY)
    if (value) {
      return JSON.parse(value) as UserType
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

const setUserFromLocalStorage = (value: UserType) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

type UserProviderProps = {
  children: React.ReactNode
}

export type UserStoreType = {
  isLoadingUser: boolean
  user: UserType
  updateUser: (fields: Partial<UserType>) => void
  clearUserData: () => void
  handleLogin: (userId: string) => void
  fetchFriends: () => void
}

const UserStoreContext = React.createContext<any>({})
export const useUserStore = () => useContext<UserStoreType>(UserStoreContext)

function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserType | null>(() => {
    const newUser = getUserFromLocalStorage()
    if (newUser) {
      return newUser
    }

    return null
  })

  const {
    value: isLoading,
    setFalse: stopLoading,
    setTrue: startLoading,
  } = useBoolean(false)

  const updateUser = (fields: Partial<UserType>) => {
    setUser((prevUser) => {
      const newUser = {
        ...structuredClone(prevUser || {}),
        ...structuredClone(fields),
      }
      return newUser as UserType
    })
  }

  const clearUserData = () => {
    setUser(null)
  }

  const fetchFriends = async (userId: string) => {
    try {
      startLoading()
      const params: ParamsFetchFriendsType = {
        userId,
      }
      const response = await authApi.getFriends(params)
      updateUser({
        friends: response,
      })
    } catch (error) {
      console.error(error)
    } finally {
      stopLoading()
    }
  }

  const fetchGroups = async (userId: string) => {
    try {
      startLoading()
      const params: ParamsFetchFriendsType = {
        userId,
      }
      const response = await authApi.getGroups(params)
      updateUser({
        groups: response,
      })
    } catch (error) {
      console.error(error)
    } finally {
      stopLoading()
    }
  }

  const handleLogin = async (userId: string) => {
    try {
      startLoading()
      const payload: PayloadLoginType = {
        userId,
      }
      const response = await authApi.login(payload)
      const { id, name, avatarURL } = response
      updateUser({ id, name, avatarURL })
      await fetchFriends(id)
      await fetchGroups(id)
    } catch (error) {
      console.error(error)
    } finally {
      stopLoading()
    }
  }

  const value = {
    isLoadingUser: isLoading,
    user,
    updateUser,
    clearUserData,
    handleLogin,
    fetchFriends,
  }

  useEffect(() => {
    if (user) {
      setUserFromLocalStorage(user)
    }
  }, [user])

  return (
    <UserStoreContext.Provider value={value}>
      {children}
    </UserStoreContext.Provider>
  )
}

export default UserProvider
