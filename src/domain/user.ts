export type FriendOfUserType = {
  id: string
  name: string
  avatarURL?: string
  conversationId: string
}

export type GroupOfUserType = {
  id: string
  name: string
  conversationId: string
  avatarURL?: string
  usersId: Array<string>
  users: Array<{
    id: string
    name: string
    avatarURL?: string
  }>
}

export type UserType = {
  id: string
  name: string
  avatarURL?: string
  groups: Array<GroupOfUserType> | []
  friends: Array<FriendOfUserType> | []
}
