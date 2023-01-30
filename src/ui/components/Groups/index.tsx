import Box from '@mui/material/Box'
import { Group } from 'domain/group'
import { Link } from 'react-router-dom'
import FriendCard from 'ui/components/FriendCard'

type Props = {
  groups: Group[]
}

function GroupsComponent({ groups }: Props) {
  const renderGroups = () => {
    return groups.map((group) => (
      <Link key={group.id} to={`/conversation/${group.conversationId}?type=group`}>
        <FriendCard {...group} />
      </Link>
    ))
  }

  return <Box>{groups?.length > 0 ? renderGroups() : null}</Box>
}

export default GroupsComponent
