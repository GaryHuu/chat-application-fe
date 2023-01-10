import ReplayIcon from '@mui/icons-material/Replay'
import ShortcutIcon from '@mui/icons-material/Shortcut'
import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { ContentType, MessageStatus } from 'domain/message'
import { formatTime } from 'lib/datetime'
import styles from './styles'

type Props = {
  name: string
  avatarURL?: string
  content: string
  createdAt: string
  status: MessageStatus
  isOwner?: boolean
  type: ContentType
  onRetry?: () => void
  onForward?: () => void
}

function RightMessage({
  name,
  avatarURL,
  content,
  createdAt,
  status = 'sent',
  isOwner = true,
  type,
  onRetry = () => {},
  onForward = () => {}
}: Props) {
  const renderStatus = () => {
    switch (status) {
      case 'sending':
        return 'Sending'
      case 'sent':
        return 'Sent'

      case 'error':
        return (
          <Typography sx={styles.text} color="red">
            Error
          </Typography>
        )

      default:
        return ''
    }
  }

  const isImage = type === 'image'

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.action}>
        {status !== 'error' && <ShortcutIcon sx={styles.actionForward} onClick={onForward} />}
      </Box>
      <Box sx={styles.left}>
        <Typography sx={styles.name}>{isOwner ? 'You' : name}</Typography>
        <Box sx={styles.content}>
          <Box sx={styles.triangle} />
          {isImage ? <img style={styles.contentImage} src={content} alt="" /> : content}
          <Box sx={styles.statusContainer}>
            <Typography sx={styles.text}>{createdAt ? formatTime(createdAt) : null}</Typography>
            <Box sx={styles.status}>
              {renderStatus()}
              {status === 'error' && <ReplayIcon onClick={onRetry} sx={styles.retryIcon} />}
            </Box>
          </Box>
        </Box>
      </Box>
      <Avatar alt={name} src={avatarURL} sx={styles.avatar} />
    </Box>
  )
}

export default RightMessage
