import { UserName } from "./user"

export type Friend = {
  id: UniqueId
  name: UserName 
  avatarURL?: URLString
  conversationId: UniqueId
}