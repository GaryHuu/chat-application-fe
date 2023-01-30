import { forwardMessage } from 'app/forwardMessage'
import useAuthenticate from 'app/useAuthenticate'
import useConversation from 'app/useConversation'
import { Conversation, ConversationType } from 'domain/conversation'
import {
  ContentMessage,
  ContentType,
  createNewMessage,
  Message as MessageType
} from 'domain/message'
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from 'services/uploadImageApi'
import ConversationComponent, { MESSAGES_CONTAINER_ELEMENT_ID } from 'ui/components/Conversation'
import ForwardModalContainer from 'ui/containers/ForwardModal'
import { checkIsBottomElement, scrollToBottomElement } from 'utils/helpers/function'
import useFriends from 'ui/containers/Friends/useFriends'
import useGroups from 'ui/containers/Groups/useGroups'

type Props = {
  conversationId: string
  type: ConversationType
}

function ConversationContainer({ conversationId, type }: Props) {
  const [isOpenForwardModal, setIsOpenForwardModal] = useState(false)
  const [messageSelectedForward, setMessageSelectedForward] = useState<MessageType>()
  const [data, setData] = useState<MessageType[]>([])
  const [lastMessageCreatedAt, setLastMessageCreatedAt] = useState<DateNow>()
  const isScrollRef = useRef(false)
  const getMessageAbortController = useRef<AbortController>()
  const navigate = useNavigate()
  const { friends } = useFriends()
  const { groups } = useGroups()

  const basicInformation: Conversation | null = useMemo(() => {
    if (!type || !friends || !groups) {
      return null
    }

    switch (type) {
      case 'personal':
        const friend = friends.find((friend) => friend.conversationId === conversationId)
        if (friend) {
          const { id, name, avatarURL } = friend
          return { id, name, avatarURL }
        }

        return null

      case 'group':
        const group = groups.find((group) => group.conversationId === conversationId)
        if (group) {
          const { id, name, avatarURL } = group
          return { id, name, avatarURL }
        }

        return null

      default:
        return null
    }
  }, [conversationId, friends, groups, type])

  const handleBack = () => {
    navigate(-1)
  }

  const { sendMessage, fetchMessages, getMessage, getMessagesInDB, getMoreMessageInDB } =
    useConversation(conversationId)
  const { user } = useAuthenticate()

  const addData = (newData: MessageType[]) => setData((prev) => [...prev, ...newData])
  const unshiftData = (newData: MessageType[]) => setData((prev) => [...newData, ...prev])

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
      const { messages: newMessagesDB, lastMessageId, lastCreatedAt } = await getMessagesInDB()
      setLastMessageCreatedAt(lastCreatedAt)
      addData(newMessagesDB)
      isScrollRef.current = true

      const newMessages = await fetchMessages(lastMessageId)
      addData(newMessages)
      isScrollRef.current = true
    } catch (error) {
      console.error(error)
    }
  }

  const getMoreMessages = async () => {
    if (!lastMessageCreatedAt) return
    const { messages, lastCreatedAt } = await getMoreMessageInDB(lastMessageCreatedAt)
    setLastMessageCreatedAt(lastCreatedAt)
    unshiftData(messages)
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
    <>
      <ConversationComponent
        user={user}
        headerData={basicInformation || undefined}
        data={data}
        onSendRetry={handleSendRetry}
        onForwardMessage={handleSetForwardMessage}
        onSendMessage={handleSendMessage}
        onBack={handleBack}
        getMoreMessages={getMoreMessages}
      />
      <ForwardModalContainer
        friends={friends}
        groups={groups}
        currentConversationId={conversationId}
        isOpen={isOpenForwardModal}
        onClose={handleCloseForwardMessage}
        onSent={handleForwardMessage}
      />
    </>
  )
}

export default ConversationContainer
