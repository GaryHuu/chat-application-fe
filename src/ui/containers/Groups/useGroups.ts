import { useEffect } from 'react'
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

  useEffect(() => {
    if (!groups) {
      fetchGroups()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { groups }
}

export default useGroups
