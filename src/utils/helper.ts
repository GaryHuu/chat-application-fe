import { UserBasicInformationType } from 'types/auth'
import { USER_STORAGE_KEY } from 'utils/constant'

export const getUserBasicInformationFromLocalStorage =
  (): UserBasicInformationType | null => {
    try {
      const value = localStorage.getItem(USER_STORAGE_KEY)
      if (value) {
        return JSON.parse(value) as UserBasicInformationType
      }
      return null
    } catch (error) {
      console.error(error)
      return null
    }
  }

export const setUserBasicInformationLocalStorage = (
  value: UserBasicInformationType
) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

export const clearUserBasicInformationLocalStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export const scrollToBottomElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}
