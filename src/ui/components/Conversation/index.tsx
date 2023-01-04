import Box from '@mui/material/Box'
import useAuthenticate from 'app/useAuthenticate'
import useConversation from 'app/useConversation'
import { ContentMessage } from 'domain/message'
import { useLayoutEffect } from 'react'
import InputMessage from 'ui/components/InputMessage'
import Message from 'ui/components/Message'
import styles from './styles'

const scrollToBottomElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}

type Props = {
  conversationId: UniqueId
}

const MESSAGES_CONTAINER_ELEMENT_ID = 'messages_container_element_id'

function ConversationComponent({ conversationId }: Props) {
  const { data, sentMessage } = useConversation(conversationId)
  const { user } = useAuthenticate()

  const handleSentMessage = (value: ContentMessage) => {
    sentMessage(value)
  }

  const renderMessages = () => {
    return data?.map((message) => {
      const {
        id,
        content,
        createdAt,
        fromUserId,
        user: { name, avatarURL },
      } = message
      return (
        <Message
          key={id}
          isOwner={fromUserId === user.id}
          name={name}
          content={content}
          avatarURL={avatarURL}
          createdAt={createdAt}
        />
      )
    })
  }

  useLayoutEffect(() => {
    scrollToBottomElement(MESSAGES_CONTAINER_ELEMENT_ID)
  }, [data])

  return (
    <Box sx={styles.wrapper}>
      <Box component='div' id={MESSAGES_CONTAINER_ELEMENT_ID} sx={styles.box}>
        {data && data?.length > 0 ? renderMessages() : null}
      </Box>
      <InputMessage onSent={handleSentMessage} />
    </Box>
  )
}

export default ConversationComponent
