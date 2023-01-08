import { ParamsGetConversationType, ParamsGetMessage, PayloadSendMessageType } from 'app/ports'
import { ContentMessage } from 'domain/message'
import { User } from 'domain/user'
import conversationApi from 'services/conversationApi'
import useConversationDB from 'services/useConversationDB'

function useConversation(conversationId: UniqueId) {
  const { initConversationDB, addMessagesToDB, addMessageToDB } = useConversationDB(conversationId)

  const sentMessage = async (content: ContentMessage, user: User) => {
    const payload: PayloadSendMessageType = {
      content,
      conversationId,
      fromUserId: user.id
    }
    const newMessage = await conversationApi.sendNewMessage(payload)
    newMessage.status = 'sent'
    addMessageToDB(newMessage)
    return newMessage
  }

  const getMessage = async (user: User, controller?: AbortController) => {
    const params: ParamsGetMessage = {
      conversationId,
      useId: user.id
    }
    const newMessage = await conversationApi.getNewMessage(params, controller)
    addMessageToDB(newMessage)
    return newMessage
  }

  const fetchMessages = async (lastMessageId?: string) => {
    const params: ParamsGetConversationType = {
      conversationId,
      lastMessageId
    }
    const newMessages = await conversationApi.getById(params)
    addMessagesToDB(newMessages)
    return newMessages
  }

  const getMessagesInDB = async () => {
    const { messages, lastMessageId } = await initConversationDB()
    return {
      messages,
      lastMessageId
    }
  }

  return {
    fetchMessages,
    sentMessage,
    getMessage,
    getMessagesInDB
  }
}

export default useConversation
