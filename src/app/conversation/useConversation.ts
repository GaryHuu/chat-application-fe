import { useUserStore } from 'app/user/UserProvider'
import { MessageType } from 'domain/message'
import useBoolean from 'hooks/useBoolean'
import { useCallback, useEffect, useRef, useState } from 'react'
import conversationApi from 'services/conversationApi'
import {
  ParamsGetMessageLongPolling,
  PayloadSendNewMessageType,
} from 'types/conversation'
import { MESSAGES_CONTAINER_ELEMENT_ID } from 'ui/components/Conversation/Messages'
import { scrollToBottomElement } from 'utils/helper'

function useConversation(conversationId: string) {
  const {
    value: isLoading,
    setTrue: startLoading,
    setFalse: stopLoading,
  } = useBoolean(false)
  const [data, setData] = useState<Array<MessageType> | []>([])
  const messageLongPollingControllerRef = useRef<AbortController>()
  const { user } = useUserStore()

  const getConversation = useCallback(async () => {
    try {
      startLoading()
      const params = {
        conversationId,
      }
      const response = await conversationApi.getById(params)
      if (response.length > 0) {
        setData(response)
      } else {
        setData([])
      }
    } catch (error) {
      console.error(error)
    } finally {
      stopLoading()
    }
  }, [conversationId, startLoading, stopLoading])

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
  }, [conversationId, user.id])

  useEffect(() => {
    scrollToBottomElement(MESSAGES_CONTAINER_ELEMENT_ID)
  }, [data])

  useEffect(() => {
    getConversation()
  }, [getConversation])

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
    getConversation,
    sentNewMessage,
    getMessageLongPolling,
  }
}

export default useConversation
