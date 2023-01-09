import { useMemo } from 'react'
import ForwardModalComponent from 'ui/components/ForwardModal'
import useFriends from 'ui/containers/Friends/useFriends'
import useGroups from 'ui/containers/Groups/useGroups'

type Props = {
  isOpen: boolean
  onSent: (ids: string[]) => void
  onClose: () => void
  currentConversationId: string
}

function ForwardModalContainer({ currentConversationId, ...otherProps }: Props) {
  const { friends } = useFriends()
  const { groups } = useGroups()

  const _friends = useMemo(
    () => friends?.filter((friend) => friend.conversationId !== currentConversationId),
    [currentConversationId, friends]
  )
  const _groups = useMemo(
    () => groups?.filter((group) => group.conversationId !== currentConversationId),
    [currentConversationId, groups]
  )

  return <ForwardModalComponent {...otherProps} friends={_friends} groups={_groups} />
}

export default ForwardModalContainer
