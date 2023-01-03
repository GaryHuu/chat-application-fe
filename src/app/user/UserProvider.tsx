import useFriendIndexedDB from 'app/user/useFriendIndexedDB'
import { UserType } from 'domain/user'
import useBoolean from 'hooks/useBoolean'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import authApi from 'services/authApi'
import {
  ParamsFetchFriendsType,
  PayloadLoginType,
  UserBasicInformationType,
} from 'types/auth'
import {
  clearUserBasicInformationLocalStorage,
  getUserBasicInformationFromLocalStorage,
  setUserBasicInformationLocalStorage,
} from 'utils/helper'
import useGroupIndexedDB from 'app/user/useGroupIndexedDB'

type UserProviderProps = {
  children: React.ReactNode
}

export type UserStoreType = {
  isLoadingUser: boolean
  user: UserType
  updateUserBasicInformation: (fields: Partial<UserType>) => void
  clearUserData: () => void
  handleLogin: (userId: string) => void
  handleLogout: () => void
  fetchFriends: () => void
}

const UserStoreContext = React.createContext<any>({})
export const useUserStore = () => useContext<UserStoreType>(UserStoreContext)

function UserProvider({ children }: UserProviderProps) {
  const [userBasicInformation, setUserBasicInformation] =
    useState<UserBasicInformationType | null>(() => {
      const newUser = getUserBasicInformationFromLocalStorage()
      if (newUser) {
        return newUser
      }

      return null
    })

  const {
    addFriends: addFriendsToDB,
    friends,
    clearFriends,
  } = useFriendIndexedDB()

  const { groups, addGroups: addGroupsToDB, clearGroups } = useGroupIndexedDB()

  const {
    value: isLoading,
    setFalse: stopLoading,
    setTrue: startLoading,
  } = useBoolean(false)

  const updateUserBasicInformation = useCallback(
    (fields: UserBasicInformationType) => {
      setUserBasicInformation(fields)
      setUserBasicInformationLocalStorage(fields)
    },
    []
  )

  const clearUserBasicInformation = useCallback(() => {
    setUserBasicInformation(null)
  }, [])

  const fetchFriends = useCallback(
    async (userId: string) => {
      try {
        startLoading()
        const params: ParamsFetchFriendsType = {
          userId,
        }
        const response = await authApi.getFriends(params)
        addFriendsToDB(response)
      } catch (error) {
        console.error(error)
      } finally {
        stopLoading()
      }
    },
    [addFriendsToDB, startLoading, stopLoading]
  )

  const fetchGroups = useCallback(
    async (userId: string) => {
      try {
        startLoading()
        const params: ParamsFetchFriendsType = {
          userId,
        }
        const response = await authApi.getGroups(params)
        addGroupsToDB(response)
      } catch (error) {
        console.error(error)
      } finally {
        stopLoading()
      }
    },
    [addGroupsToDB, startLoading, stopLoading]
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
        updateUserBasicInformation({ id, name, avatarURL })
        await fetchFriends(id)
        await fetchGroups(id)
      } catch (error) {
        console.error(error)
      } finally {
        stopLoading()
      }
    },
    [
      fetchFriends,
      fetchGroups,
      startLoading,
      stopLoading,
      updateUserBasicInformation,
    ]
  )

  const handleLogout = useCallback(() => {
    clearUserBasicInformation()
    clearUserBasicInformationLocalStorage()
    clearFriends()
    clearGroups()
  }, [clearFriends, clearGroups, clearUserBasicInformation])

  const value = useMemo(() => {
    const user = {
      ...userBasicInformation,
      friends,
      groups,
    }

    return {
      isLoadingUser: isLoading,
      user,
      handleLogin,
      handleLogout,
    }
  }, [
    friends,
    groups,
    handleLogin,
    handleLogout,
    isLoading,
    userBasicInformation,
  ])

  return (
    <UserStoreContext.Provider value={value}>
      {children}
    </UserStoreContext.Provider>
  )
}

export default UserProvider
