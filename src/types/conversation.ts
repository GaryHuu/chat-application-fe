export type ParamsGetConversationByIdType = {
  conversationId: string
  lastMessageId?: string
}

export type PayloadSendNewMessageType = {
  conversationId: string
  fromUserId: string
  content: string
}

export type ParamsGetMessageLongPolling = {
  conversationId: string
  useId: string
}
