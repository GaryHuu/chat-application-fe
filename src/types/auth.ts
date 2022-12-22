export type PayloadLoginType = {
  userId: string
}

type ResponseFriendOfUserLoginType = {
  conversationID: string
  userId: string
}

export type ResponseLoginType = {
  id: string
  name: string
  avatarURL?: string
  groups: Array<string> | []
  friends: Array<ResponseFriendOfUserLoginType> | []
}

export type ParamsFetchFriendsType = {
  userId: string
}
