import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { formatTime } from 'lib/datetime'
import styles from './styles'

type Props = {
  name: string
  avatarURL?: string
  content: string
  createdAt: string
}

function LeftMessage({ name, avatarURL, content, createdAt }: Props) {
  return (
    <Box sx={styles.wrapper}>
      <Avatar alt={name} src={avatarURL} sx={styles.avatar} />
      <Box sx={styles.right}>
        <Typography sx={styles.name}>{name}</Typography>
        <Box sx={styles.content}>
          <Box sx={styles.triangle} />
          {content}
          <Typography sx={styles.time}>{createdAt ? formatTime(createdAt) : null}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default LeftMessage
