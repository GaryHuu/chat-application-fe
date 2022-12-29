export type PayloadLoginType = {
  userId: string
}

type ResponseFriendOfUserLoginType = {
  conversationID: string
  userId: string
}

export type Response0fLoginType = {
  id: string
  name: string
  avatarURL?: string
  groups: Array<string> | []  
  friends: Array<ResponseFriendOfUserLoginType> | []
}

export type ParamsFetchFriendsType = {
  userId: string
}

export type UserBasicInformationType = {
  id: string
  name: string
  avatarURL?: string
}
