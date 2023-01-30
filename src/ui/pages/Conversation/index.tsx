import { ConversationType } from 'domain/conversation'
import { useParams, useSearchParams } from 'react-router-dom'
import ConversationContainer from 'ui/containers/Conversation'

function ConversationPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') as ConversationType

  if (!id || !type) {
    return null
  }

  return <ConversationContainer conversationId={id} type={type} />
}

export default ConversationPage
