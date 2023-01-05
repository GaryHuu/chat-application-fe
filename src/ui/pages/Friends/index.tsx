import useFriends from 'app/useFriends'
import FriendsComponent from 'ui/components/Friends'

function FriendsPage() {
  const { friends } = useFriends()
  return <FriendsComponent friends={friends} />
}

export default FriendsPage
