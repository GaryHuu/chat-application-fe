import { Message } from 'domain/message'
import { PayloadSendMessageType } from 'app/ports'
import conversationApi from 'services/conversationApi'

export const forwardMessage = async (message: Message, idsConversation: UniqueId[]) => {
  const forwardPromises = idsConversation.map((conversationId) => {
    const payload: PayloadSendMessageType = {
      content: message.content,
      conversationId,
      fromUserId: message.fromUserId
    }

    return conversationApi.sendNewMessage(payload)
  })

  await Promise.all(forwardPromises)
}
