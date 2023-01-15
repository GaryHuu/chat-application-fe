import {
  ParamsGetConversationInfo,
  ParamsGetConversationType,
  ParamsGetMessage,
  PayloadSendMessageType
} from 'app/ports'
import { Message as MessageType, MessageStatus } from 'domain/message'
import { User } from 'domain/user'
import conversationApi from 'services/conversationApi'
import useConversationDB from 'services/useConversationDB'
import { normalizeMessage, normalizeMessages } from 'utils/helpers/function'

function useConversation(conversationId: UniqueId) {
  const { initConversationDB, addMessagesToDB, addMessageToDB } = useConversationDB(conversationId)

  const sendMessage = async (message: MessageType) => {
    try {
      const payload: PayloadSendMessageType = {
        content: message.content,
        conversationId,
        fromUserId: message.fromUserId,
        type: message.type
      }
      const newMessage = await conversationApi.sendNewMessage(payload)
      newMessage.status = 'sent'
      const newMessageNormalized = normalizeMessage(newMessage)
      addMessageToDB(newMessageNormalized)
      return newMessageNormalized
    } catch (error) {
      const newMessage = {
        ...message,
        status: 'error' as MessageStatus
      }
      return newMessage
    }
  }

  const getMessage = async (user: User, controller?: AbortController) => {
    const params: ParamsGetMessage = {
      conversationId,
      userId: user.id
    }
    const newMessage = await conversationApi.getNewMessage(params, controller)
    newMessage.status = 'sent'
    const newMessageNormalized = normalizeMessage(newMessage)
    addMessageToDB(newMessageNormalized)
    return newMessageNormalized
  }

  const fetchMessages = async (lastMessageId?: string) => {
    const params: ParamsGetConversationType = {
      conversationId,
      lastMessageId
    }
    const newMessages = await conversationApi.getById(params)
    const newMessagesNormalized = normalizeMessages(newMessages)
    addMessagesToDB(newMessagesNormalized)
    return newMessagesNormalized
  }

  const getMessagesInDB = async () => {
    const { messages, lastMessageId } = await initConversationDB()
    return {
      messages,
      lastMessageId
    }
  }

  const getConversationBasicInformation = async (userId: UniqueId) => {
    const params: ParamsGetConversationInfo = {
      conversationId,
      userId
    }
    const conversation = await conversationApi.getConversationInfo(params)
    return conversation
  }

  return {
    fetchMessages,
    sendMessage,
    getMessage,
    getMessagesInDB,
    getConversationBasicInformation
  }
}

export default useConversation
