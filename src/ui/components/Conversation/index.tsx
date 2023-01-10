import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  checkIsOwnerMessage,
  ContentMessage,
  ContentType,
  Message as MessageType
} from 'domain/message'
import { User } from 'domain/user'
import InputMessage from 'ui/components/InputMessage'
import Message from 'ui/components/Message'
import styles from './styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

type Props = {
  data: MessageType[]
  onSendRetry: (message: MessageType) => Promise<void>
  onForwardMessage: (message: MessageType) => void
  onSendMessage: (value: ContentMessage | File, type: ContentType) => Promise<void>
  onBack: () => void
  user: User
  headerData: {
    avatarURL?: string
    name?: string
    conversationId: string
  }
}

export const MESSAGES_CONTAINER_ELEMENT_ID = 'messages_container_element_id'

function ConversationComponent({
  data,
  onBack,
  onSendRetry,
  onSendMessage,
  onForwardMessage,
  user,
  headerData
}: Props) {
  const renderMessages = () => {
    return data?.map((message) => {
      const {
        id,
        content,
        type,
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
          type={type}
          content={content}
          avatarURL={avatarURL}
          createdAt={createdAt}
          onRetry={() => onSendRetry(message)}
          onForward={() => onForwardMessage(message)}
        />
      )
    })
  }

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.header}>
        <Box>
          <ArrowBackIcon onClick={onBack} sx={styles.backIcon} />
        </Box>
        <Box sx={styles.information}>
          <Typography sx={styles.informationName}>{headerData?.name}</Typography>
          <Avatar sx={styles.avatar} alt={'1'} src={headerData?.avatarURL} />
        </Box>
      </Box>
      <Box component="div" id={MESSAGES_CONTAINER_ELEMENT_ID} sx={styles.box}>
        {data && data?.length > 0 ? renderMessages() : null}
      </Box>
      <InputMessage onSent={onSendMessage} />
    </Box>
  )
}

export default ConversationComponent
