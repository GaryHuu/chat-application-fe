import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { MessageStatus } from 'domain/message'
import { formatTime } from 'lib/datetime'
import styles from './styles'
import ReplayIcon from '@mui/icons-material/Replay'

type Props = {
  name: string
  avatarURL?: string
  content: string
  createdAt: string
  status: MessageStatus
  isOwner?: boolean
  onRetry?: () => void
}

function RightMessage({
  name,
  avatarURL,
  content,
  createdAt,
  status,
  isOwner = true,
  onRetry
}: Props) {
  const handleRetry = () => {
    onRetry?.()
  }

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

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.left}>
        <Typography sx={styles.name}>{isOwner ? 'You' : name}</Typography>
        <Box sx={styles.content}>
          <Box sx={styles.triangle} />
          {content}
          <Box sx={styles.statusContainer}>
            <Typography sx={styles.text}>{createdAt ? formatTime(createdAt) : null}</Typography>
            <Box sx={styles.status}>
              {renderStatus()}
              {status === 'error' && <ReplayIcon onClick={handleRetry} sx={styles.retryIcon} />}
            </Box>
          </Box>
        </Box>
      </Box>
      <Avatar alt={name} src={avatarURL} sx={styles.avatar} />
    </Box>
  )
}

export default RightMessage
