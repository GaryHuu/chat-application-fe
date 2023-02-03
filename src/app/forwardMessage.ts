import { Message } from 'domain/message'
import { PayloadSendMessageType } from 'app/ports'
import conversationApi from 'services/conversationApi'
import { encryptData } from 'utils/helpers/function'

export const forwardMessage = async (message: Message, idsConversation: UniqueId[]) => {
  const forwardPromises = idsConversation.map((conversationId) => {
    const payload: PayloadSendMessageType = {
      content: encryptData(message.content),
      conversationId,
      fromUserId: message.fromUserId,
      type: message.type
    }

    return conversationApi.sendNewMessage(payload)
  })

  await Promise.all(forwardPromises)
}
