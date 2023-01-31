import { forwardMessage } from 'app/forwardMessage'
import useAuthenticate from 'app/useAuthenticate'
import useConversation from 'app/useConversation'
import { Conversation, ConversationType } from 'domain/conversation'
import { Friend } from 'domain/friend'
import { Group } from 'domain/group'
import { ContentMessage, ContentType, createNewMessage, Message } from 'domain/message'
import { UserName } from 'domain/user'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from 'services/uploadImageApi'
import ConversationComponent, { MESSAGES_CONTAINER_ELEMENT_ID } from 'ui/components/Conversation'
import ForwardModalContainer from 'ui/containers/ForwardModal'
import { checkIsBottomElement, scrollToBottomElement } from 'utils/helpers/function'

export type MessageType = Message & {
  user: {
    name: UserName
    id: UniqueId
    avatarURL?: URLString
  }
}

type Props = {
  conversationId: string
  type: ConversationType
  friends: Friend[]
  groups: Group[]
}

function ConversationContainer({ conversationId, type, friends, groups }: Props) {
  const [isOpenForwardModal, setIsOpenForwardModal] = useState(false)
  const [messageSelectedForward, setMessageSelectedForward] = useState<Message>()
  const [data, setData] = useState<MessageType[]>([])
  const [lastMessageCreatedAt, setLastMessageCreatedAt] = useState<DateNow>()
  const isScrollRef = useRef(false)
  const getMessageAbortController = useRef<AbortController>()
  const navigate = useNavigate()

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

  const addFromUserData = (message: Message): MessageType | null => {
    if (!type || !friends || !groups) {
      return null
    }

    const isOwner = message.fromUserId === user.id
    if (isOwner) {
      return {
        ...message,
        user: { ...user }
      }
    }

    switch (type) {
      case 'personal':
        const user = friends.find((friend) => friend.id === message.fromUserId)
        if (user) {
          const { id, name, avatarURL } = user
          return {
            ...message,
            user: { id, name, avatarURL }
          }
        }
        return null

      case 'group':
        const group = groups.find((group) => group.conversationId === conversationId)
        if (group) {
          const { users } = group
          const user = users.find((user) => user.id === message.fromUserId)
          if (user) {
            const { id, name, avatarURL } = user
            return {
              ...message,
              user: { id, name, avatarURL }
            }
          }
        }

        return null

      default:
        return null
    }
  }

  const handleSendMessage = async (value: ContentMessage | File, type: ContentType) => {
    let newMessage: Message

    if (type === 'image' && typeof value === 'object') {
      const url = await uploadImage(value)
      newMessage = createNewMessage(user, url, 'image')
    } else {
      newMessage = createNewMessage(user, value as string)
    }

    const newMessageData = addFromUserData(newMessage)
    if (newMessageData) {
      addData([newMessageData])
      isScrollRef.current = true
    }

    const newMessageResponse = await sendMessage(newMessage)
    const messageSent = addFromUserData(newMessageResponse)

    if (messageSent) {
      replaceData(newMessage.id, messageSent)
    }
  }

  const handleSendRetry = async (message: MessageType) => {
    const newMessage = { ...message }
    newMessage.status = 'sending'
    replaceData(newMessage.id, newMessage)
    isScrollRef.current = true

    const newMessageResponse = await sendMessage(newMessage)
    const messageSent = addFromUserData(newMessageResponse)

    if (messageSent) {
      replaceData(newMessage.id, messageSent)
    }
  }

  const initConversation = async () => {
    try {
      const { messages: newMessagesDB, lastMessageId, lastCreatedAt } = await getMessagesInDB()
      const newMessages: MessageType[] = []
      for (const message of newMessagesDB) {
        const newMessage = addFromUserData(message)
        if (newMessage) {
          newMessages.push(newMessage)
        }
      }
      setLastMessageCreatedAt(lastCreatedAt)
      addData(newMessages)
      isScrollRef.current = true

      const newMessagesFetched = await fetchMessages(lastMessageId)
      const newMessagesFromFetch: MessageType[] = []
      for (const message of newMessagesFetched) {
        const newMessage = addFromUserData(message)
        if (newMessage) {
          newMessagesFromFetch.push(newMessage)
        }
      }
      addData(newMessagesFromFetch)
      isScrollRef.current = true
    } catch (error) {
      console.error(error)
    }
  }

  const getMoreMessages = async () => {
    if (!lastMessageCreatedAt) return
    const { messages, lastCreatedAt } = await getMoreMessageInDB(lastMessageCreatedAt)
    const newMessages: MessageType[] = []
    for (const message of messages) {
      const newMessage = addFromUserData(message)
      if (newMessage) {
        newMessages.push(newMessage)
      }
    }
    setLastMessageCreatedAt(lastCreatedAt)
    unshiftData(newMessages)
  }

  const getMessageLongPolling = async () => {
    try {
      getMessageAbortController.current = new AbortController()
      const newMessage = await getMessage(user, getMessageAbortController.current)
      const message = addFromUserData(newMessage)
      const isAborted = getMessageAbortController?.current?.signal.aborted
      if (!isAborted && message) {
        const isBottom = checkIsBottomElement(MESSAGES_CONTAINER_ELEMENT_ID)
        if (isBottom) {
          isScrollRef.current = true
        } else {
          isScrollRef.current = false
        }
        addData([message])
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

  const handleScroll = (priority = false) => {
    if (isScrollRef.current || priority) {
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
        onScrollDown={() => handleScroll(true)}
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
