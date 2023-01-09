import useFriends from 'ui/containers/Friends/useFriends'
import useGroups from 'ui/containers/Groups/useGroups'

type ReturnType = {
  avatarURL?: URLString
  id?: UniqueId
  name?: string
}

function useConversationBasicInformation(id: UniqueId): ReturnType {
  const { friends } = useFriends()
  const { groups } = useGroups()

  const currentFriend = friends?.find((friend) => friend.conversationId === id)
  if (currentFriend) {
    return {
      avatarURL: currentFriend.avatarURL,
      name: currentFriend.name
    }
  }

  const currentGroup = groups?.find((group) => group.conversationId === id)
  if (currentGroup) {
    return {
      avatarURL: currentGroup.avatarURL,
      name: currentGroup.name
    }
  }

  return {}
}

export default useConversationBasicInformation
