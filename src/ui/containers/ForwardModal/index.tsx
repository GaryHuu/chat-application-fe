import { Friend } from 'domain/friend'
import { Group } from 'domain/group'
import { useMemo } from 'react'
import ForwardModalComponent from 'ui/components/ForwardModal'

type Props = {
  isOpen: boolean
  onSent: (ids: string[]) => void
  onClose: () => void
  currentConversationId: string
  friends: Friend[]
  groups: Group[]
}

function ForwardModalContainer({ currentConversationId, friends, groups, ...otherProps }: Props) {
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
