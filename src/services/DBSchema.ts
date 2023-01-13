import { Message } from 'domain/message'
import { RequestType } from 'domain/request'

export type RequestSchema = RequestType & {}

export type MessageSchema = Message & {}
