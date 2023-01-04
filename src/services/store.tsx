import { Friend } from 'domain/friend'
import { Group } from 'domain/group'
import { User } from 'domain/user'
import React, { useContext, useState } from 'react'
import { getUser, saveUser, clearUser } from './userLocalStorage'

const StoreContext = React.createContext<any>({})
export const useStore = () => useContext<any>(StoreContext)

const initUser = () => {
  const user = getUser()
  return user
}

function Provider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | undefined>(initUser)
  const [friends, setFriends] = useState<Friend[]>()
  const [groups, setGroups] = useState<Group[]>()

  // User
  const updateUser = (newUser: User) => {
    setUser(newUser)
    saveUser(newUser)
  }

  const emptyUser = () => {
    setUser(undefined)
    clearUser()
  }

  // Friends
  const updateFriends = (newFriends: Friend[]) => {
    setFriends(newFriends)
  }

  const emptyFriends = () => {
    setFriends(undefined)
  }

  // Groups
  const updateGroups = (newGroups: Group[]) => {
    setGroups(newGroups)
  }

  const emptyGroups = () => {
    setGroups(undefined)
  }

  const value = {
    user,
    updateUser,
    emptyUser,
    friends,
    updateFriends,
    emptyFriends,
    groups,
    updateGroups,
    emptyGroups,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export default Provider
