import { ContentMessage, ContentType, MessageStatus } from 'domain/message'
import { RequestType } from 'domain/request'

export type RequestSchema = RequestType & {}

export type MessageSchema = {
  id: UniqueId
  fromUserId: UniqueId
  toConversationId: UniqueId
  status: MessageStatus
  content: ContentMessage
  createdAt: DateNow
  type: ContentType
}
