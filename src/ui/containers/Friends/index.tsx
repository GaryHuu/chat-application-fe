import FriendsComponent from 'ui/components/Friends'
import useFriends from 'ui/containers/Friends/useFriends'

function FriendsContainer() {
  const { friends } = useFriends()

  return <FriendsComponent friends={friends} />
}

export default FriendsContainer
