import Box from '@mui/material/Box'
import { useUserStore } from 'app/user/UserProvider'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import FriendCard from 'ui/components/FriendCard'

function Friends() {
  const { user } = useUserStore()

  const friends = useMemo(() => user?.friends || [], [user])

  const renderFriends = () => {
    return friends.map((friend) => (
      <Link key={friend.id} to={`/conversation/${friend.conversationId}`}>
        <FriendCard {...friend} />
      </Link>
    ))
  }

  return <Box>{friends.length > 0 ? renderFriends() : null}</Box>
}

export default Friends
