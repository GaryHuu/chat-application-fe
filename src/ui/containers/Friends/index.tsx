import useFriends from 'app/useFriends'
import FriendsComponent from 'ui/components/Friends'
import { useEffect } from 'react'

function FriendsContainer() {
  const { friends, fetchFriends } = useFriends()

  useEffect(() => {
    if (!friends) {
      fetchFriends()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <FriendsComponent friends={friends} />
}

export default FriendsContainer
