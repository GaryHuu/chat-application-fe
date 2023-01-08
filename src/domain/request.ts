type RequestMethod = 'get' | 'post' | 'patch' | 'delete' | 'put'

export type RequestType = {
  endpoint: string
  sendingTime: DateTimeString
  method: RequestMethod
  params?: object
}
