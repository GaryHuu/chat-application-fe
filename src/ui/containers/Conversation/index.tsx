import useAuthenticate from 'app/useAuthenticate'
import useConversation from 'app/useConversation'
import {
  ContentMessage,
  ContentType,
  createNewMessage,
  Message as MessageType
} from 'domain/message'
import { checkIsBottomElement, scrollToBottomElement } from 'utils/helpers/function'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ConversationComponent, { MESSAGES_CONTAINER_ELEMENT_ID } from 'ui/components/Conversation'
import { forwardMessage } from 'app/forwardMessage'
import ForwardModalContainer from 'ui/containers/ForwardModal'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from 'services/uploadImageApi'
import { Conversation } from 'domain/conversation'

type Props = {
  conversationId: string
}

function ConversationContainer({ conversationId }: Props) {
  const [isOpenForwardModal, setIsOpenForwardModal] = useState(false)
  const [messageSelectedForward, setMessageSelectedForward] = useState<MessageType>()
  const [data, setData] = useState<MessageType[]>([])
  const [basicInformation, setBasicInformation] = useState<Conversation>()
  const isScrollRef = useRef(false)
  const getMessageAbortController = useRef<AbortController>()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const {
    sendMessage,
    fetchMessages,
    getMessage,
    getMessagesInDB,
    getConversationBasicInformation
  } = useConversation(conversationId)
  const { user } = useAuthenticate()

  const addData = (newData: MessageType[]) => setData((prev) => [...prev, ...newData])

  const replaceData = (id: string, newData: MessageType) => {
    setData((prev) => {
      const newValue = prev.filter((value) => value.id !== id)
      newValue.push(newData)
      return newValue
    })
  }

  const handleSendMessage = async (value: ContentMessage | File, type: ContentType) => {
    let newMessage: MessageType

    if (type === 'image' && typeof value === 'object') {
      const url = await uploadImage(value)
      newMessage = createNewMessage(user, url, 'image')
      addData([newMessage])
      isScrollRef.current = true
    } else {
      newMessage = createNewMessage(user, value as string)
      addData([newMessage])
      isScrollRef.current = true
    }

    const newMessageResponse = await sendMessage(newMessage)
    replaceData(newMessage.id, newMessageResponse)
  }

  const handleSendRetry = async (message: MessageType) => {
    const newMessage = { ...message }
    newMessage.status = 'sending'
    replaceData(newMessage.id, newMessage)
    isScrollRef.current = true

    const newMessageResponse = await sendMessage(newMessage)
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

  const handleSetForwardMessage = (message: MessageType) => {
    const newMessage = createNewMessage(user, message.content, message.type)
    setMessageSelectedForward(newMessage)
    setIsOpenForwardModal(true)
  }

  const handleForwardMessage = async (idsConversation: string[]) => {
    try {
      if (!messageSelectedForward || idsConversation.length === 0) {
        throw new Error()
      }
      await forwardMessage(messageSelectedForward, idsConversation)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseForwardMessage = () => {
    setIsOpenForwardModal(false)
    setMessageSelectedForward(undefined)
  }

  const handleScroll = () => {
    if (isScrollRef.current) {
      isScrollRef.current = false
      scrollToBottomElement(MESSAGES_CONTAINER_ELEMENT_ID)
    }
  }

  const fetchConversationBasicInformation = async () => {
    try {
      const conversation = await getConversationBasicInformation(user.id)
      setBasicInformation(conversation)
    } catch (error) {
      console.error(error)
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
    fetchConversationBasicInformation()
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
    <>
      <ConversationComponent
        user={user}
        headerData={basicInformation}
        data={data}
        onSendRetry={handleSendRetry}
        onForwardMessage={handleSetForwardMessage}
        onSendMessage={handleSendMessage}
        onBack={handleBack}
      />
      <ForwardModalContainer
        currentConversationId={conversationId}
        isOpen={isOpenForwardModal}
        onClose={handleCloseForwardMessage}
        onSent={handleForwardMessage}
      />
    </>
  )
}

export default ConversationContainer
