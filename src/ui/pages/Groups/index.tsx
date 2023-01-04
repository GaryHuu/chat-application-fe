import useGroups from 'app/useGroups'
import GroupsComponent from 'ui/components/Groups'

function GroupsPage() {
  const { groups } = useGroups()
  return <GroupsComponent groups={groups} />
}

export default GroupsPage
