import {
  ParamsGetConversationInfo,
  ParamsGetConversationType,
  ParamsGetMessage,
  PayloadSendMessageType
} from 'app/ports'
import { Conversation } from 'domain/conversation'
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
    fromUserId,
    type
  }: PayloadSendMessageType): Promise<Message> {
    const url = `/conversations/${conversationId}`
    const payload = {
      content,
      fromUserId,
      type
    }
    return axiosClient.post(url, payload)
  },
  getNewMessage(
    { conversationId, userId }: ParamsGetMessage,
    controller?: AbortController
  ): Promise<Message> {
    const url = `/conversations/${conversationId}/message`
    const params = {
      userId
    }
    return axiosClient.get(url, {
      params,
      signal: controller?.signal || undefined
    })
  },
  getConversationInfo({ conversationId, userId }: ParamsGetConversationInfo): Promise<Conversation> {
    const url = `/conversations/${conversationId}/info`
    const params = {
      userId
    }
    return axiosClient.get(url, {
      params
    })
  }
}

export default conversationApi
