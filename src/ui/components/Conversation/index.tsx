import Box from '@mui/material/Box'
import { checkIsOwnerMessage, ContentMessage, Message as MessageType } from 'domain/message'
import { User } from 'domain/user'
import InputMessage from 'ui/components/InputMessage'
import Message from 'ui/components/Message'
import styles from './styles'

type Props = {
  data: MessageType[]
  onSentRetry: (message: MessageType) => Promise<void>
  onSentMessage: (value: ContentMessage) => Promise<void>
  user: User
}

export const MESSAGES_CONTAINER_ELEMENT_ID = 'messages_container_element_id'

function ConversationComponent({ data, onSentRetry, onSentMessage, user }: Props) {
  const renderMessages = () => {
    return data?.map((message) => {
      const {
        id,
        content,
        createdAt,
        status,
        user: { name, avatarURL }
      } = message
      return (
        <Message
          key={id}
          isOwner={checkIsOwnerMessage(user, message)}
          status={status}
          name={name}
          content={content}
          avatarURL={avatarURL}
          createdAt={createdAt}
          onRetry={() => onSentRetry(message)}
        />
      )
    })
  }

  return (
    <Box sx={styles.wrapper}>
      <Box component="div" id={MESSAGES_CONTAINER_ELEMENT_ID} sx={styles.box}>
        {data && data?.length > 0 ? renderMessages() : null}
      </Box>
      <InputMessage onSent={onSentMessage} />
    </Box>
  )
}

export default ConversationComponent
