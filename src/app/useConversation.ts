import { ParamsGetConversationType, ParamsGetMessage, PayloadSendMessageType } from 'app/ports'
import useAuthenticate from 'app/useAuthenticate'
import { ContentMessage, Message } from 'domain/message'
import { useEffect, useRef, useState } from 'react'
import conversationApi from 'services/conversationApi'
import useConversationDB from 'services/useConversationDB'

function useConversation(conversationId: UniqueId) {
  const [data, setData] = useState<Message[]>([])
  const getMessageRef = useRef<AbortController>()

  const { user } = useAuthenticate()
  const { initConversationDB, addMessagesToDB } = useConversationDB(conversationId)

  const sentMessage = async (content: ContentMessage) => {
    try {
      const payload: PayloadSendMessageType = {
        content,
        conversationId,
        fromUserId: user.id
      }
      const newMessage = await conversationApi.sendNewMessage(payload)
      setData((prev) => {
        return [...prev, newMessage]
      })
      addMessagesToDB([newMessage])
    } catch (error) {
      console.error(error)
    }
  }

  const getMessage = async () => {
    try {
      getMessageRef.current = new AbortController()
      const params: ParamsGetMessage = {
        conversationId,
        useId: user.id
      }
      const response = await conversationApi.getNewMessage(params, getMessageRef?.current)

      const isAborted = getMessageRef?.current?.signal.aborted
      if (!isAborted) {
        setData((prev) => {
          return [...prev, response]
        })
        addMessagesToDB([response])
      }
    } catch (error) {
      console.error(error)
    } finally {
      const isAborted = getMessageRef?.current?.signal.aborted
      if (!isAborted) {
        getMessage()
      }
    }
  }

  const fetchData = async () => {
    try {
      const { messages: messagesDB, lastMessageId } = await initConversationDB()
      const params: ParamsGetConversationType = {
        conversationId,
        lastMessageId
      }
      const newMessage = await conversationApi.getById(params)
      addMessagesToDB(newMessage)
      setData([...messagesDB, ...newMessage])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getMessage()

    return () => {
      if (getMessageRef?.current) {
        getMessageRef.current.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    data,
    sentMessage
  }
}

export default useConversation
