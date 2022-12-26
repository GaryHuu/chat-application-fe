import { UserType } from 'domain/user'
import useBoolean from 'hooks/useBoolean'
import {
  clearUserLocalStorage,
  getUserFromLocalStorage,
  setUserLocalStorage,
} from 'utils/helper'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import authApi from 'services/authApi'
import { ParamsFetchFriendsType, PayloadLoginType } from 'types/auth'

type UserProviderProps = {
  children: React.ReactNode
}

export type UserStoreType = {
  isLoadingUser: boolean
  user: UserType
  updateUser: (fields: Partial<UserType>) => void
  clearUserData: () => void
  handleLogin: (userId: string) => void
  handleLogout: () => void
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

  const updateUser = useCallback((fields: Partial<UserType>) => {
    setUser((prevUser) => {
      const newUser = {
        ...structuredClone(prevUser || {}),
        ...structuredClone(fields),
      }
      return newUser as UserType
    })
  }, [])

  const clearUserData = useCallback(() => {
    setUser(null)
  }, [])

  const fetchFriends = useCallback(
    async (userId: string) => {
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
    },
    [startLoading, stopLoading, updateUser]
  )

  const fetchGroups = useCallback(
    async (userId: string) => {
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
    },
    [startLoading, stopLoading, updateUser]
  )

  const handleLogin = useCallback(
    async (userId: string) => {
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
    },
    [fetchFriends, fetchGroups, startLoading, stopLoading, updateUser]
  )

  const handleLogout = useCallback(() => {
    clearUserData()
    clearUserLocalStorage()
  }, [clearUserData])

  const value = useMemo(
    () => ({
      isLoadingUser: isLoading,
      user,
      updateUser,
      clearUserData,
      handleLogin,
      handleLogout,
      fetchFriends,
    }),
    [
      clearUserData,
      fetchFriends,
      handleLogin,
      handleLogout,
      isLoading,
      updateUser,
      user,
    ]
  )

  useEffect(() => {
    if (user) {
      setUserLocalStorage(user)
    }
  }, [user])

  return (
    <UserStoreContext.Provider value={value}>
      {children}
    </UserStoreContext.Provider>
  )
}

export default UserProvider
