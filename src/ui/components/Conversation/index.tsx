import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { CircularProgress } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Conversation } from 'domain/conversation'
import { checkIsOwnerMessage, ContentMessage, ContentType } from 'domain/message'
import { User } from 'domain/user'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import InputMessage from 'ui/components/InputMessage'
import MessageComponent from 'ui/components/Message'
import { MessageType } from 'ui/containers/Conversation'
import styles from './styles'

type Props = {
  data: MessageType[]
  onSendRetry: (message: MessageType) => Promise<void>
  getMoreMessages: () => Promise<void>
  onForwardMessage: (message: MessageType) => void
  onSendMessage: (value: ContentMessage | File, type: ContentType) => Promise<void>
  onBack: () => void
  onScrollDown: () => void
  user: User
  headerData?: Conversation
}

export const MESSAGES_CONTAINER_ELEMENT_ID = 'messages_container_element_id'

function ConversationComponent({
  data,
  onBack,
  onScrollDown,
  onSendRetry,
  onSendMessage,
  onForwardMessage,
  getMoreMessages,
  user,
  headerData
}: Props) {
  const { ref } = useInView({
    threshold: 0,
    onChange(inView) {
      if (inView) {
        handleLoadMore()
      }
    }
  })

  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isShowScrollDown, setIsShowScrollDown] = useState(false)

  const renderMessages = () => {
    return (
      <>
        <div ref={ref} />
        {data.map((message) => {
          const {
            id,
            content,
            type,
            createdAt,
            status,
            user: { name, avatarURL }
          } = message
          return (
            <MessageComponent
              key={id}
              isOwner={checkIsOwnerMessage(user, message)}
              status={status}
              name={name}
              type={type}
              content={content}
              avatarURL={avatarURL}
              createdAt={createdAt}
              onRetry={() => onSendRetry(message)}
              onForward={() => onForwardMessage(message)}
            />
          )
        })}
      </>
    )
  }

  const handleLoadMore = async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    await getMoreMessages()
    setIsLoadingMore(false)
  }

  useEffect(() => {
    const element = document.getElementById(MESSAGES_CONTAINER_ELEMENT_ID)
    if (!element) return

    const eventScroll = () => {
      if (element?.scrollHeight <= Math.ceil(element?.scrollTop + element?.clientHeight)) {
        setIsShowScrollDown(false)
      } else {
        setIsShowScrollDown(true)
      }
    }

    eventScroll()
    element.addEventListener('scroll', eventScroll)
    return () => element.removeEventListener('scroll', eventScroll)
  }, [])

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.header}>
        <Box>
          <ArrowBackIcon onClick={onBack} sx={styles.backIcon} />
        </Box>
        <Box sx={styles.information}>
          <Typography sx={styles.informationName}>{headerData?.name}</Typography>
          <Avatar sx={styles.avatar} alt={'1'} src={headerData?.avatarURL} />
        </Box>
      </Box>
      <Box
        sx={styles.background}
        style={{
          backgroundImage: `url('${headerData?.avatarURL}')`
        }}
      />
      <Box component="div" id={MESSAGES_CONTAINER_ELEMENT_ID} sx={styles.box}>
        {isLoadingMore && (
          <Box sx={styles.loading}>
            <CircularProgress size={10} />
          </Box>
        )}
        {data && data?.length > 0 ? renderMessages() : null}
        {isShowScrollDown ? (
          <Box component="div" onClick={onScrollDown} sx={styles.scrollDownIcon}>
            <KeyboardArrowDownIcon />
          </Box>
        ) : null}
      </Box>
      <InputMessage onSent={onSendMessage} />
    </Box>
  )
}

export default ConversationComponent
