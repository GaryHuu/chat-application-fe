import { GroupName } from './group'
import { UserName } from './user'

export type Conversation = {
  name: UserName | GroupName
  avatarURL?: URLString
  id: UniqueId
}

export type ConversationType = 'personal' | 'group'
