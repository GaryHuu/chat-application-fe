import { Message } from 'domain/message'

export type RequestMethod = 'get' | 'post' | 'patch' | 'delete' | 'put'

export type RequestSchema = {
  endpoint: string
  sendingTime: DateTimeString
  method: RequestMethod
  params?: object
}

export type MessageSchema = Message & {}
