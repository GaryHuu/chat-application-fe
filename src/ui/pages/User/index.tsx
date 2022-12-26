import LogoutIcon from '@mui/icons-material/Logout'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useUserStore } from 'app/user/UserProvider'

function User() {
  const { user, handleLogout } = useUserStore()

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        marginTop: '20vh',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Avatar
        alt={user.name}
        src={user.avatarURL}
        sx={{
          width: 100,
          height: 100,
          border: '1px solid #d3d3d3',
        }}
      />
      <Typography
        sx={{
          marginTop: '10px',
          color: '#424242',
        }}
        variant='h4'
      >
        {user.name}
      </Typography>
      <Box
        sx={{
          width: '200px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton onClick={handleLogout} aria-label='delete' size='large'>
          <LogoutIcon fontSize='inherit' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default User
