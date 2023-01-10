import ShortcutIcon from '@mui/icons-material/Shortcut'
import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { ContentType } from 'domain/message'
import { formatTime } from 'lib/datetime'
import styles from './styles'

type Props = {
  name: string
  avatarURL?: string
  content: string
  type: ContentType
  createdAt: string
  onForward?: () => void
}

function LeftMessage({ name, avatarURL, content, createdAt, type, onForward = () => {} }: Props) {
  const isImage = type === 'image'

  return (
    <Box sx={styles.wrapper}>
      <Avatar alt={name} src={avatarURL} sx={styles.avatar} />
      <Box sx={styles.right}>
        <Typography sx={styles.name}>{name}</Typography>
        <Box sx={styles.content}>
          <Box sx={styles.triangle} />
          {isImage ? <img style={styles.contentImage} src={content} alt="" /> : content}
          <Typography sx={styles.time}>{createdAt ? formatTime(createdAt) : null}</Typography>
        </Box>
      </Box>
      <Box sx={styles.action}>
        <ShortcutIcon sx={styles.actionForward} onClick={onForward} />
      </Box>
    </Box>
  )
}

export default LeftMessage
