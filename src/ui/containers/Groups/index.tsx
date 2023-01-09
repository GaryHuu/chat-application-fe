import useGroups from 'ui/containers/Groups/useGroups'
import GroupsComponent from 'ui/components/Groups'

function GroupsContainer() {
  const { groups } = useGroups()

  return <GroupsComponent groups={groups} />
}

export default GroupsContainer
