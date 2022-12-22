import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useUserStore } from 'app/UserProvider'
import { useNavigate } from 'react-router-dom'

import { useState } from 'react'

function Login() {
  const [userId, setUserId] = useState('63a41b4142a7c568e84c6c0e')
  const { isLoadingUser, handleLogin, user } = useUserStore()
  let navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value)
  }

  const onSubmit = async () => {
    handleLogin(userId)
  }

  console.log(user)

  if (user) {
    navigate('/')
  }

  return (
    <Box
      p={10}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20vh',
        height: '100vh',
      }}
    >
      <Typography
        sx={{
          fontSize: 30,
          fontWeight: 'bold',
        }}
      >
        Login
      </Typography>
      <TextField
        label='User ID'
        variant='outlined'
        value={userId}
        onChange={handleChange}
        sx={{
          margin: '30px 0 16px',
          width: '300px',
        }}
      />
      <LoadingButton
        loading={isLoadingUser}
        disabled={!userId}
        onClick={onSubmit}
        size='medium'
        variant='contained'
      >
        Submit
      </LoadingButton>
    </Box>
  )
}

export default Login
