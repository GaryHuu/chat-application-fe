import { ContentMessage, ContentType, MessageStatus } from 'domain/message'
import { RequestType } from 'domain/request'
import { UserName } from 'domain/user'

export type RequestSchema = RequestType & {}

export type MessageSchema = {
  id: UniqueId
  fromUserId: UniqueId
  status: MessageStatus
  content: ContentMessage
  createdAt: DateNow
  type: ContentType
  user: {
    name: UserName
    id: UniqueId
    avatarURL?: URLString
  }
}
