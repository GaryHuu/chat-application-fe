import { User } from 'domain/user'
import { Friend } from 'domain/friend'
import { Group } from 'domain/group'
import { ContentMessage, ContentType } from 'domain/message'

// Auth API
export type PayloadLoginType = {
  userId: UniqueId
}

// Conversation API
export type ParamsGetConversationType = {
  conversationId: UniqueId
  lastMessageId?: UniqueId
}
export type PayloadSendMessageType = {
  content: ContentMessage
  conversationId: UniqueId
  fromUserId: UniqueId
  type: ContentType
}

export type ParamsGetMessage = {
  conversationId: UniqueId
  userId: UniqueId
}

export type ParamsGetConversationInfo = {
  conversationId: UniqueId
  userId: UniqueId
}

// Main Port
export interface UserStorageService {
  user: User
  updateUser(user: User): void
  emptyUser(): void
}

export interface FriendsStorageService {
  friends: Friend[]
  updateFriends(friends: Friend[]): void
  emptyFriends(): void
}

export interface GroupsStorageService {
  groups: Group[]
  updateGroups(groups: Group[]): void
  emptyGroups(): void
}
