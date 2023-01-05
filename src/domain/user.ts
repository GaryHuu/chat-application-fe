export type UserName = string

export type User = {
  id: UniqueId
  name: UserName
  avatarURL?: URLString
}

export function checkIsLogged(user: User): boolean {
  return !!user?.id
}
