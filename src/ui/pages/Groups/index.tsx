import useGroups from 'app/useGroups'
import GroupsComponent from 'ui/components/Groups'
import { useEffect } from 'react'

function GroupsPage() {
  const { groups, fetchGroups } = useGroups()

  useEffect(() => {
    if (!groups) {
      fetchGroups()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <GroupsComponent groups={groups} />
}

export default GroupsPage
