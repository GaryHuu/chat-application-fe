import { useUserStore } from 'app/user/UserProvider'
import { MessageType } from 'domain/message'
import { LeftMessage, RightMessage } from 'ui/components/Message'

export const MESSAGES_CONTAINER_ELEMENT_ID = 'messages_container_element_id'

type Props = {
  conversationData: Array<MessageType> | []
}

function Messages({ conversationData = [] }: Props) {
  const { user } = useUserStore()

  return (
    <>
      {conversationData.map((message) => {
        const {
          content,
          createdAt,
          id,
          user: { name, avatarURL, id: userId },
        } = message

        const isYou = userId === user.id

        return isYou ? (
          <RightMessage
            key={id}
            name={name}
            avatarURL={avatarURL}
            content={content}
            createdAt={createdAt}
          />
        ) : (
          <LeftMessage
            key={id}
            name={name}
            avatarURL={avatarURL}
            content={content}
            createdAt={createdAt}
          />
        )
      })}
    </>
  )
}

export default Messages
