import { Message } from 'domain/message'
import { MessageSchema } from 'services/DBSchema'

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

export const normalizeMessagesToMessagesSchema = (messages: Message[]): MessageSchema[] => {
  return messages as MessageSchema[]
}

export const normalizeMessagesSchemaToMessages = (messagesDB: MessageSchema[]): Message[] => {
  return messagesDB as Message[]
}
