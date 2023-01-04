import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import styles from './styles'

type Props = {
  name: string
  avatarURL?: string
}

function FriendCard({ name, avatarURL }: Props) {
  return (
    <Box sx={styles.wrapper}>
      <Avatar alt={name} src={avatarURL} sx={styles.avatar} />
      <Typography sx={styles.name} variant='h6'>
        {name}
      </Typography>
    </Box>
  )
}

export default FriendCard
