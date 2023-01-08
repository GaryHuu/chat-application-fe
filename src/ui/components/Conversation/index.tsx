import Box from '@mui/material/Box'
import useAuthenticate from 'app/useAuthenticate'
import useConversation from 'app/useConversation'
import {
  checkIsOwnerMessage,
  ContentMessage,
  createNewMessage,
  Message as MessageType
} from 'domain/message'
import { useEffect, useRef, useState } from 'react'
import InputMessage from 'ui/components/InputMessage'
import Message from 'ui/components/Message'
import styles from './styles'

const scrollToBottomElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}

const checkIsBottomElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    return element?.scrollHeight <= Math.ceil(element?.scrollTop + element?.clientHeight)
  }

  return false
}

type Props = {
  conversationId: UniqueId
}

const MESSAGES_CONTAINER_ELEMENT_ID = 'messages_container_element_id'

function ConversationComponent({ conversationId }: Props) {
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

  useEffect(() => {
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
          onRetry={() => handleSentRetry(message)}
        />
      )
    })
  }

  return (
    <Box sx={styles.wrapper}>
      <Box component="div" id={MESSAGES_CONTAINER_ELEMENT_ID} sx={styles.box}>
        {data && data?.length > 0 ? renderMessages() : null}
      </Box>
      <InputMessage onSent={handleSentMessage} />
    </Box>
  )
}

export default ConversationComponent
