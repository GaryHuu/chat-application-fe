import { UserType } from 'domain/user'
import { USER_STORAGE_KEY } from 'utils/constant'

export const getUserFromLocalStorage = (): UserType | null => {
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

export const setUserLocalStorage = (value: UserType) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

export const clearUserLocalStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export const scrollToBottomElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}
