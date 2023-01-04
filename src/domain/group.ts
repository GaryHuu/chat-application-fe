import { UserName } from "./user"

export type GroupName = string

export type Group = {
  id: UniqueId
  name: GroupName
  conversationId: UniqueId
  avatarURL?: URLString
  users: Array<{
    id: UniqueId
    name: UserName     
		avatarURL?: URLString
  }>
}