import { User } from 'domain/user'
import { USER_STORAGE_KEY } from 'utils/constants'

const saveUser = (user: User) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } catch (error) {
    console.error(error)
  }
}

const getUser = (): User | undefined => {
  try {
    const value = localStorage.getItem(USER_STORAGE_KEY)
    if (value) {
      return JSON.parse(value) as User
    }
    return undefined
  } catch (error) {
    console.error(error)
    return undefined
  }
}

const clearUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export { saveUser, getUser, clearUser }
