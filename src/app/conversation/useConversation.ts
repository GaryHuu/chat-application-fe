import { useUserStore } from 'app/user/UserProvider'
import { MessageType } from 'domain/message'
import useBoolean from 'hooks/useBoolean'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import conversationApi from 'services/conversationApi'
import {
  ParamsGetConversationByIdType,
  ParamsGetMessageLongPolling,
  PayloadSendNewMessageType,
} from 'types/conversation'
import { MESSAGES_CONTAINER_ELEMENT_ID } from 'ui/components/Conversation/Messages'
import { CONVERSATION_DB_NAME } from 'utils/constant'
import { scrollToBottomElement } from 'utils/helper'

function useConversation(conversationId: string) {
  const {
    value: isLoading,
    setTrue: startLoading,
    setFalse: stopLoading,
  } = useBoolean(false)
  const [data, setData] = useState<Array<MessageType> | []>([])
  const messageLongPollingControllerRef = useRef<AbortController>()
  const dbRef = useRef<IDBDatabase>()
  const { user } = useUserStore()

  const getMessagesInConversation = useCallback(
    async (lastMessageId?: string) => {
      try {
        startLoading()
        const params: ParamsGetConversationByIdType = {
          conversationId,
          lastMessageId,
        }
        const response = await conversationApi.getById(params)
        return response
      } catch (error) {
        console.error(error)
      } finally {
        stopLoading()
      }
    },
    [conversationId, startLoading, stopLoading]
  )

  const sentNewMessage = useCallback(
    async (content: string) => {
      try {
        if (!conversationId || !content || isLoading) throw new Error()
        const payload: PayloadSendNewMessageType = {
          content,
          conversationId,
          fromUserId: user.id,
        }
        const response = await conversationApi.sendNewMessage(payload)
        setData((prev) => {
          return [...prev, response]
        })
      } catch (error) {
        console.error(error)
      }
    },
    [conversationId, isLoading, user.id]
  )

  const addMessagesToDB = useCallback(
    (messages: Array<MessageType>) => {
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
    },
    [conversationId]
  )

  const getMessageLongPolling = useCallback(async () => {
    try {
      const params: ParamsGetMessageLongPolling = {
        conversationId,
        useId: user.id,
      }
      messageLongPollingControllerRef.current = new AbortController()

      const response = await conversationApi.getNewMessageLongPolling(
        params,
        messageLongPollingControllerRef?.current
      )

      const isAborted = messageLongPollingControllerRef?.current?.signal.aborted
      if (!isAborted) {
        addMessagesToDB([response])
        setData((prev) => {
          return [...prev, response]
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      const isAborted = messageLongPollingControllerRef?.current?.signal.aborted
      if (!isAborted) {
        getMessageLongPolling()
      }
    }
  }, [addMessagesToDB, conversationId, user.id])

  const getAllMessagesInDB = useCallback(() => {
    return new Promise<Array<MessageType>>((resolve, reject) => {
      if (!dbRef.current) {
        reject('Database not found')
        return
      }

      const request = dbRef.current
        .transaction(conversationId, 'readwrite')
        .objectStore(conversationId)
        .getAll()

      request.onsuccess = () => {
        const messages = request.result as Array<MessageType>
        resolve(messages)
      }

      request.onerror = (err) => {
        reject(`Error to get message information: ${err}`)
      }
    })
  }, [conversationId])

  const init = useCallback(() => {
    const dbName = `${CONVERSATION_DB_NAME}_${conversationId}`
    const request: IDBOpenDBRequest = indexedDB.open(dbName, 1)

    request.onerror = () => {
      console.error(request.error)
    }

    request.onupgradeneeded = (event: any) => {
      dbRef.current = event?.target?.result as IDBDatabase
      const objectStore = dbRef.current.createObjectStore(conversationId, {
        keyPath: 'id',
      })
      objectStore.createIndex('id', 'id', { unique: true })
    }

    request.onsuccess = async (event: any) => {
      try {
        dbRef.current = event?.target?.result as IDBDatabase
        let newData: Array<MessageType> | [] = []
        const newMessagesInDB = await getAllMessagesInDB()
        let lastMessageId

        if (newMessagesInDB.length > 0) {
          lastMessageId = newMessagesInDB[newMessagesInDB.length - 1].id
          newData = [...newMessagesInDB]
        }

        const newMessages = await getMessagesInConversation(lastMessageId)

        if (newMessages && newMessages?.length > 0) {
          addMessagesToDB(newMessages)
          newData = [...newData, ...newMessages]
        }

        setData(newData)
      } catch (error) {
        console.error(error)
      }
    }
  }, [
    addMessagesToDB,
    conversationId,
    getAllMessagesInDB,
    getMessagesInConversation,
  ])

  useLayoutEffect(() => {
    scrollToBottomElement(MESSAGES_CONTAINER_ELEMENT_ID)
  }, [data])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    getMessageLongPolling()
  }, [getMessageLongPolling])

  useEffect(() => {
    return () => {
      if (messageLongPollingControllerRef?.current) {
        messageLongPollingControllerRef.current.abort()
      }
    }
  }, [])

  return {
    isLoading,
    data,
    sentNewMessage,
  }
}

export default useConversation
