import Box from '@mui/material/Box'
import { Friend } from 'domain/friend'
import { Link } from 'react-router-dom'
import FriendCard from 'ui/components/FriendCard'

type Props = {
  friends: Friend[]
}

function FriendsComponent({ friends }: Props) {
  const renderFriends = () => {
    return friends.map((friend) => (
      <Link key={friend.id} to={`/conversation/${friend.conversationId}`}>
        <FriendCard {...friend} />
      </Link>
    ))
  }

  return <Box>{friends?.length > 0 ? renderFriends() : null}</Box>
}

export default FriendsComponent
