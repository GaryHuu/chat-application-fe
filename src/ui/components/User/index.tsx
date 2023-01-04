import LogoutIcon from '@mui/icons-material/Logout'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { User } from 'domain/user'

import styles from './styles'

type Props = {
  user: User
  handleLogout: () => void
}

function UserComponent({ user, handleLogout }: Props) {
  return (
    <Box sx={styles.wrapper}>
      <Avatar src={user?.avatarURL} alt={user.name} sx={styles.avatar} />
      <Typography sx={styles.name} variant='h4'>
        {user.name}
      </Typography>
      <Box sx={styles.wrapperIcon}>
        <IconButton onClick={handleLogout} aria-label='delete' size='large'>
          <LogoutIcon fontSize='inherit' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default UserComponent
