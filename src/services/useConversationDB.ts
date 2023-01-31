import { Message } from 'domain/message'
import { CONVERSATION_DB_NAME } from 'utils/constants'
import {
  normalizeMessagesSchemaToMessages,
  normalizeMessagesToMessagesSchema
} from 'utils/helpers/function'
import { MessageSchema } from 'services/DBSchema'

const OBJECT_STORE_NAME = 'messages'
const CREATED_AT_MAX = 9_999_999_999_999
const MAX_MESSAGE_MORE = 20

let dbRef: IDBDatabase | null

function useConversationDB(conversationId: UniqueId) {
  const addMessagesToDB = (messages: Message[]) => {
    if (!dbRef) {
      console.error('Database not found')
      return
    }

    const transaction = dbRef.transaction(OBJECT_STORE_NAME, 'readwrite')
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)

    const messageDB = normalizeMessagesToMessagesSchema(messages, conversationId)

    messageDB.forEach((message) => {
      const request = objectStore.add(message)

      request.onsuccess = () => {}
      request.onerror = (err) => {
        console.error(`Error to add new message: ${err}`)
      }
    })

    transaction.oncomplete = () => {}
  }

  const addMessageToDB = (message: Message) => {
    addMessagesToDB([message])
  }

  const getMessagesDBMore = (
    lastCreatedAt: DateNow = CREATED_AT_MAX,
    moreNumber: number = MAX_MESSAGE_MORE
  ) => {
    return new Promise<{
      messages: Message[]
      lastMessageId?: UniqueId
      lastCreatedAt?: DateNow
    }>((resolve, reject) => {
      if (!dbRef) {
        reject('Database not found')
        return
      }

      const transaction = dbRef.transaction(OBJECT_STORE_NAME, 'readwrite')
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
      const index = objectStore.index('toConversationId_createdAt')
      const keyRangeValue = IDBKeyRange.bound(
        [conversationId, 0],
        [conversationId, lastCreatedAt - 1]
      )
      const messagesDB: MessageSchema[] = []
      index.openCursor(keyRangeValue, 'prev').onsuccess = (event: any) => {
        const cursor = event.target.result as IDBCursorWithValue

        if (!cursor || messagesDB.length >= moreNumber) {
          if (messagesDB.length > 0) {
            const lastCreatedAt = messagesDB[messagesDB.length - 1].createdAt
            const messages = normalizeMessagesSchemaToMessages(messagesDB).reverse()
            const lastMessageId = messages[messages.length - 1].id as UniqueId
            resolve({
              messages,
              lastMessageId,
              lastCreatedAt
            })
            return
          }

          resolve({ messages: [] })
        }

        if (cursor) {
          const message = cursor.value as MessageSchema
          messagesDB.push(message)
          cursor.continue()
        }
      }
    })
  }

  const initConversationDB = () => {
    return new Promise<{
      messages: Message[]
      lastCreatedAt?: DateNow
      lastMessageId?: UniqueId
    }>((resolve, reject) => {
      const dbName = `${CONVERSATION_DB_NAME}`
      const request: IDBOpenDBRequest = indexedDB.open(dbName, 1)

      request.onerror = () => {
        reject(request.error)
      }

      request.onupgradeneeded = (event: any) => {
        dbRef = event?.target?.result as IDBDatabase
        const objectStore = dbRef.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: 'id'
        })
        objectStore.createIndex('toConversationId_createdAt', ['toConversationId', 'createdAt'], {
          unique: false
        })
      }

      request.onsuccess = async (event: any) => {
        try {
          dbRef = event?.target?.result as IDBDatabase
          const { lastMessageId, messages, lastCreatedAt } = await getMessagesDBMore()
          resolve({ lastMessageId, messages, lastCreatedAt })
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  return {
    initConversationDB,
    addMessagesToDB,
    addMessageToDB,
    getMessagesDBMore
  }
}

export default useConversationDB
