import { ParamsGetConversationType, ParamsGetMessage, PayloadSendMessageType } from 'app/ports'
import { Message } from 'domain/message'
import axiosClient from './axiosClient'

const conversationApi = {
  getById({ conversationId, lastMessageId }: ParamsGetConversationType): Promise<Message[]> {
    const url = `/conversations/${conversationId}`
    return axiosClient.get(url, {
      params: {
        lastMessageId: lastMessageId || null
      }
    })
  },
  sendNewMessage({
    content,
    conversationId,
    fromUserId
  }: PayloadSendMessageType): Promise<Message> {
    const url = `/conversations/${conversationId}`
    const payload = {
      content,
      fromUserId
    }
    return axiosClient.post(url, payload)
  },
  getNewMessage(
    { conversationId, useId }: ParamsGetMessage,
    controller?: AbortController
  ): Promise<Message> {
    const url = `/conversations/${conversationId}/message`
    const params = {
      useId
    }
    return axiosClient.get(url, {
      params,
      signal: controller?.signal || undefined
    })
  }
}

export default conversationApi
