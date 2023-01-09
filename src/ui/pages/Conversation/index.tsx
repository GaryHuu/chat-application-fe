import { useParams } from 'react-router-dom'
import ConversationContainer from 'ui/containers/Conversation'

function ConversationPage() {
  const { id } = useParams()

  if (!id) {
    return null
  }

  return <ConversationContainer conversationId={id} />
}

export default ConversationPage
