import { useFriendsStorage, useUserStorage } from 'services/storageAdapter'
import userApi from 'services/userApi'

function useFriends() {
  const { friends, updateFriends } = useFriendsStorage()
  const { user } = useUserStorage()

  const fetchFriends = async () => {
    try {
      const friendsResponse = await userApi.getFriends(user.id)
      updateFriends(friendsResponse)
    } catch (error) {
      console.error(error)
    }
  }

  return { friends, fetchFriends }
}

export default useFriends
