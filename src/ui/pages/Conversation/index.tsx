import { useParams } from 'react-router-dom'
import ConversationComponent from 'ui/components/Conversation'

function ConversationPage() {
  const { id } = useParams()

  if (!id) {
    return null
  }

  return <ConversationComponent conversationId={id} />
}

export default ConversationPage
