import { MessageType } from 'domain/message'
import {
  ParamsGetConversationByIdType,
  ParamsGetMessageLongPolling,
  PayloadSendNewMessageType,
} from 'types/conversation'
import axiosClient from './axiosClient'

const conversationApi = {
  getById(data: ParamsGetConversationByIdType): Promise<Array<MessageType>> {
    const url = `/conversations/${data.conversationId}`
    return axiosClient.get(url, {
      params: { 
        lastMessageId: data?.lastMessageId || null,
      },
    })
  },
  sendNewMessage({
    content,
    conversationId,
    fromUserId,
  }: PayloadSendNewMessageType): Promise<MessageType> {
    const url = `/conversations/${conversationId}`
    const payload = {
      content,
      fromUserId,
    }
    return axiosClient.post(url, payload)
  },
  getNewMessageLongPolling(
    { conversationId, useId }: ParamsGetMessageLongPolling,
    controller?: AbortController
  ): Promise<MessageType> {
    const url = `/conversations/${conversationId}/message`
    const params = {
      useId,
    }
    return axiosClient.get(url, {
      params,
      signal: controller?.signal || undefined,
    })
  },
}

export default conversationApi
