import Box from '@mui/material/Box'
import { useUserStore } from 'app/user/UserProvider'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import GroupCard from 'ui/components/GroupCard'

function Groups() {
  const { user } = useUserStore()

  const groups = useMemo(() => user?.groups || [], [user])

  const renderGroups = () => {
    return groups.map((group) => (
      <Link key={group.id} to={`/conversation/${group.conversationId}`}>
        <GroupCard {...group} />
      </Link>
    ))
  }

  return <Box>{groups.length > 0 ? renderGroups() : null}</Box>
}

export default Groups
