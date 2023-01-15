import { Message } from 'domain/message'
import { RequestType } from 'domain/request'
import { MessageSchema, RequestSchema } from 'services/DBSchema'

export const scrollToBottomElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}

export const checkIsBottomElement = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    return element?.scrollHeight <= Math.ceil(element?.scrollTop + element?.clientHeight)
  }

  return false
}

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
  })
}

export const normalizeMessages = (messages: Message[]): Message[] => {
  return messages.map((message) => {
    const { content, createdAt, fromUserId, id, status = 'sent', type, user } = message
    return { content, createdAt, fromUserId, id, status, type, user }
  })
}

export const normalizeMessage = (message: Message): Message => {
  const { content, createdAt, fromUserId, id, status, type, user } = message
  return { content, createdAt, fromUserId, id, status, type, user }
}

export const normalizeMessagesToMessagesSchema = (messages: Message[]): MessageSchema[] => {
  return messages.map((message) => {
    return {
      ...message,
      createdAt: new Date(message.createdAt).getTime()
    }
  })
}

export const normalizeMessagesSchemaToMessages = (messagesDB: MessageSchema[]): Message[] => {
  return messagesDB.map((messageDB) => {
    return {
      ...messageDB,
      createdAt: new Date(messageDB.createdAt).toISOString()
    }
  })
}

export const normalizeRequestToRequestSchema = (requests: RequestType[]): RequestSchema[] => {
  return requests as RequestSchema[]
}

export const normalizeRequestSchemaToRequest = (requests: RequestSchema[]): RequestType[] => {
  return requests as RequestType[]
}

export const calculatePercent = (origin: number, value: number) => {
  if (origin === 0) return value === 0 ? 0 : 100
  return ((value - origin) / origin) * 100
}
