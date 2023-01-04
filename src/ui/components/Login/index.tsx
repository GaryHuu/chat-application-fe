import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'

import { checkIsLogged, User } from 'domain/user'
import { useState } from 'react'
import styles from './styles'

type Props = {
  user: User
  handleLogin: (userId: string) => void
}

function LoginComponent({ handleLogin, user }: Props) {
  const [userId, setUserId] = useState('63a41b4142a7c568e84c6c0e')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value)
  }

  const onSubmit = async () => {
    if (userId) {
      handleLogin(userId)
    }
  }

  if (checkIsLogged(user)) {
    return <Navigate to='/' />
  }

  return (
    <Box p={10} sx={styles.wrapper}>
      <Typography sx={styles.title}>Login</Typography>
      <TextField
        label='User ID'
        variant='outlined'
        value={userId}
        onChange={handleChange}
        sx={styles.input}
      />
      <LoadingButton
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

export default LoginComponent
