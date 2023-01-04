import { Message } from 'domain/message'
import { useRef } from 'react'
import { CONVERSATION_DB_NAME } from 'utils/constants'

function useConversationDB(conversationId: UniqueId) {
  const dbRef = useRef<IDBDatabase>()

  const addMessagesToDB = (messages: Message[]) => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }

    const transaction = dbRef.current.transaction(conversationId, 'readwrite')
    const objectStore = transaction.objectStore(conversationId)

    messages.forEach((message) => {
      const request = objectStore.add(message)

      request.onsuccess = () => {}
      request.onerror = (err) => {
        console.error(`Error to add new message: ${err}`)
      }
    })

    transaction.oncomplete = () => {}
  }

  const getMessagesDB = () => {
    return new Promise<{
      messages: Message[]
      lastMessageId?: UniqueId
    }>((resolve, reject) => {
      if (!dbRef.current) {
        reject('Database not found')
        return
      }

      const request = dbRef.current
        .transaction(conversationId, 'readwrite')
        .objectStore(conversationId)
        .getAll()

      request.onsuccess = () => {
        const messages = request.result as Message[]
        if (messages.length > 0) {
          const lastMessageId = messages[messages.length - 1].id as UniqueId
          resolve({ messages, lastMessageId })
        }

        resolve({ messages: [] })
      }

      request.onerror = (err) => {
        reject(`Error to get message information: ${err}`)
      }
    })
  }

  const initConversationDB = () => {
    return new Promise<{
      messages: Message[]
      lastMessageId?: UniqueId
    }>((resolve, reject) => {
      const dbName = `${CONVERSATION_DB_NAME}_${conversationId}`
      const request: IDBOpenDBRequest = indexedDB.open(dbName, 1)

      request.onerror = () => {
        reject(request.error)
      }

      request.onupgradeneeded = (event: any) => {
        dbRef.current = event?.target?.result as IDBDatabase
        const objectStore = dbRef.current.createObjectStore(conversationId, {
          keyPath: 'id'
        })
        objectStore.createIndex('id', 'id', { unique: true })
      }

      request.onsuccess = async (event: any) => {
        try {
          dbRef.current = event?.target?.result as IDBDatabase
          const { lastMessageId, messages } = await getMessagesDB()
          resolve({ lastMessageId, messages })
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  return {
    initConversationDB,
    addMessagesToDB
  }
}

export default useConversationDB
