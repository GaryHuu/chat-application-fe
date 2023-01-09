import authApi from 'services/authApi'
import { useFriendsStorage, useUserStorage, useGroupsStorage } from 'services/storageAdapter'

function useAuthenticate() {
  const { updateUser, user, emptyUser } = useUserStorage()
  const { emptyFriends } = useFriendsStorage()
  const { emptyGroups } = useGroupsStorage()

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
    emptyGroups()
  }

  return {
    user,
    handleLogin,
    handleLogout
  }
}

export default useAuthenticate
