import { useGroupsStorage, useUserStorage } from 'services/storageAdapter'
import userApi from 'services/userApi'

function useGroups() {
  const { user } = useUserStorage()
  const { groups, updateGroups } = useGroupsStorage()

  const fetchGroups = async () => {
    try {
      const groupsResponse = await userApi.getGroups(user.id)
      updateGroups(groupsResponse)
    } catch (error) {
      console.error(error)
    }
  }

  return { groups, fetchGroups }
}

export default useGroups
