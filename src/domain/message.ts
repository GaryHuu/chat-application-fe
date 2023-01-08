import { currentDatetime } from 'lib/datetime'
import { User, UserName } from './user'

export type ContentMessage = string
export type MessageStatus = 'sending' | 'sent' | 'error'

export type Message = {
  id: UniqueId
  fromUserId: UniqueId
  status: MessageStatus
  content: ContentMessage
  createdAt: DateTimeString
  updatedAt: DateTimeString
  user: {
    name: UserName
    id: UniqueId
    avatarURL?: URLString
  }
}

export function checkIsOwnerMessage(user: User, message: Message): boolean {
  return user.id === message.fromUserId
}

export function createNewMessage(user: User, content: ContentMessage): Message {
  const newMessage: Message = {
    id: Date.now().toString(),
    fromUserId: user.id,
    status: 'sending',
    content,
    createdAt: currentDatetime(),
    updatedAt: currentDatetime(),
    user: {
      name: user.name,
      id: user.id,
      avatarURL: user?.avatarURL
    }
  }
  return newMessage
}
