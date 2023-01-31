import { currentDatetime } from 'lib/datetime'
import { User } from './user'

export type ContentMessage = string
export type MessageStatus = 'sending' | 'sent' | 'error'
export type ContentType = 'text' | 'image'

export type Message = {
  id: UniqueId
  fromUserId: UniqueId
  status: MessageStatus
  content: ContentMessage
  createdAt: DateTimeString
  type: ContentType
}

export function checkIsOwnerMessage(user: User, message: Message): boolean {
  return user.id === message.fromUserId
}

export function createNewMessage(
  user: User,
  content: ContentMessage,
  type: ContentType = 'text'
): Message {
  const newMessage: Message = {
    id: Date.now().toString(),
    fromUserId: user.id,
    status: 'sending',
    type,
    content,
    createdAt: currentDatetime()
  }
  return newMessage
}
