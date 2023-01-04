import authApi from 'services/authApi'
import { useFriendsStorage, useUserStorage } from 'services/storageAdapter'

function useAuthenticate() {
  const { updateUser, user, emptyUser } = useUserStorage()
  const { emptyFriends } = useFriendsStorage()

  const handleLogin = async (userId: UniqueId) => {
    try {
      const payload = {
        userId
      }
      const { id, name, avatarURL } = await authApi.login(payload)
      updateUser({ id, name, avatarURL })
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = () => {
    emptyUser()
    emptyFriends()
  }

  return {
    user,
    handleLogin,
    handleLogout
  }
}

export default useAuthenticate
