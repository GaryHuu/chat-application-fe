import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { MessageStatus } from 'domain/message'
import { formatTime } from 'lib/datetime'
import styles from './styles'

type Props = {
  name: string
  avatarURL?: string
  content: string
  createdAt: string
  status: MessageStatus
  isOwner?: boolean
}

function RightMessage({ name, avatarURL, content, createdAt, status, isOwner = true }: Props) {
  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.left}>
        <Typography sx={styles.name}>{isOwner ? 'You' : name}</Typography>
        <Box sx={styles.content}>
          <Box sx={styles.triangle} />
          {content}
          <Typography sx={styles.time}>
            {createdAt ? formatTime(createdAt) : null} {status === 'sending' ? 'Sending' : 'Sent'}
          </Typography>
        </Box>
      </Box>
      <Avatar alt={name} src={avatarURL} sx={styles.avatar} />
    </Box>
  )
}

export default RightMessage
