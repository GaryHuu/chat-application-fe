import useAuthenticate from 'app/useAuthenticate'
import useConversation from 'app/useConversation'
import { ContentMessage, createNewMessage, Message as MessageType } from 'domain/message'
import { checkIsBottomElement, scrollToBottomElement } from 'utils/helpers/function'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ConversationComponent, { MESSAGES_CONTAINER_ELEMENT_ID } from 'ui/components/Conversation'

type Props = {
  conversationId: string
}

function ConversationContainer({ conversationId }: Props) {
  const [data, setData] = useState<MessageType[]>([])
  const isScrollRef = useRef(false)
  const getMessageAbortController = useRef<AbortController>()

  const { sentMessage, fetchMessages, getMessage, getMessagesInDB } =
    useConversation(conversationId)
  const { user } = useAuthenticate()

  const addData = (newData: MessageType[]) => setData((prev) => [...prev, ...newData])

  const replaceData = (id: string, newData: MessageType) => {
    setData((prev) => {
      const newValue = prev.filter((value) => value.id !== id)
      newValue.push(newData)
      return newValue
    })
  }

  const handleSentMessage = async (value: ContentMessage) => {
    const newMessage = createNewMessage(user, value)
    addData([newMessage])
    isScrollRef.current = true

    const newMessageResponse = await sentMessage(newMessage)
    replaceData(newMessage.id, newMessageResponse)
  }

  const handleSentRetry = async (message: MessageType) => {
    const newMessage = { ...message }
    newMessage.status = 'sending'
    replaceData(newMessage.id, newMessage)
    isScrollRef.current = true

    const newMessageResponse = await sentMessage(newMessage)
    replaceData(message.id, newMessageResponse)
  }

  const initConversation = async () => {
    try {
      const { messages: newMessagesDB, lastMessageId } = await getMessagesInDB()
      addData(newMessagesDB)
      isScrollRef.current = true

      const newMessages = await fetchMessages(lastMessageId)
      addData(newMessages)
      isScrollRef.current = true
    } catch (error) {
      console.error(error)
    }
  }

  const getMessageLongPolling = async () => {
    try {
      getMessageAbortController.current = new AbortController()
      const newMessage = await getMessage(user, getMessageAbortController.current)
      const isAborted = getMessageAbortController?.current?.signal.aborted
      if (!isAborted) {
        const isBottom = checkIsBottomElement(MESSAGES_CONTAINER_ELEMENT_ID)
        if (isBottom) {
          isScrollRef.current = true
        } else {
          isScrollRef.current = false
        }
        addData([newMessage])
      }
    } catch (error) {
      console.error(error)
    } finally {
      const isAborted = getMessageAbortController?.current?.signal.aborted
      if (!isAborted) {
        getMessageLongPolling()
      }
    }
  }

  const handleScroll = () => {
    if (isScrollRef.current) {
      isScrollRef.current = false
      scrollToBottomElement(MESSAGES_CONTAINER_ELEMENT_ID)
    }
  }

  useLayoutEffect(() => {
    handleScroll()
  }, [data])

  useEffect(() => {
    initConversation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getMessageLongPolling()

    return () => {
      if (getMessageAbortController?.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        getMessageAbortController.current.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ConversationComponent
      user={user}
      data={data}
      onSentRetry={handleSentRetry}
      onSentMessage={handleSentMessage}
    />
  )
}

export default ConversationContainer
