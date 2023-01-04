import { useEffect } from 'react'
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

  useEffect(() => {
    if (!friends) {
      fetchFriends()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { friends }
}

export default useFriends
