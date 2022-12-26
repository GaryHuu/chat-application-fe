import { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import ConversationComponent from 'ui/components/Conversation'

function Conversation() {
  const { id } = useParams()

  return (
    <Fragment>
      {id ? <ConversationComponent conversationId={id} /> : null}
    </Fragment>
  )
}

export default Conversation
