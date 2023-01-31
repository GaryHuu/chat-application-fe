import { ConversationType } from 'domain/conversation'
import { useParams, useSearchParams } from 'react-router-dom'
import ConversationContainer from 'ui/containers/Conversation'
import useFriends from 'ui/containers/Friends/useFriends'
import useGroups from 'ui/containers/Groups/useGroups'

function ConversationPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') as ConversationType

  const { friends } = useFriends()
  const { groups } = useGroups()

  if (!id || !type || !friends || !groups) {
    return null
  }

  return <ConversationContainer conversationId={id} type={type} friends={friends} groups={groups} />
}

export default ConversationPage
