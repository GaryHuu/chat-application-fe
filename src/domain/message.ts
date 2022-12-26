type UserOfMessageType = {
  name: string
  id: string
  avatarURL?: string
}

export type MessageType = {
  id: string
  fromUserId: string
  content: string
  createdAt: string
  updatedAt: string
  user: UserOfMessageType
}
