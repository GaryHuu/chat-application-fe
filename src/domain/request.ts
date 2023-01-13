export type RequestMethod = 'get' | 'post' | 'patch' | 'delete' | 'put'

export type RequestType = {
  id: UniqueId
  endpoint: string
  sendingTime: number
  method: RequestMethod
}
