import Box from '@mui/material/Box'
import useConversation from 'app/conversation/useConversation'
import InputMessageBox from 'ui/components/Conversation/InputMessageBox'
import Messages, {
  MESSAGES_CONTAINER_ELEMENT_ID,
} from 'ui/components/Conversation/Messages'

type Props = {
  conversationId: string
}

function ConversationComponent({ conversationId }: Props) {
  const { data, sentNewMessage } = useConversation(conversationId)

  const handleSentMessage = (value: string) => {
    if (value) {
      sentNewMessage(value)
    }
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component='div'
        id={MESSAGES_CONTAINER_ELEMENT_ID}
        sx={{
          padding: '5px 10px',
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <Messages conversationData={data} />
      </Box>
      <InputMessageBox onSent={handleSentMessage} />
    </Box>
  )
}

export default ConversationComponent
