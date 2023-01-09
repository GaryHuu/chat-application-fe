import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { checkIsLogged, User } from 'domain/user'
import { useState } from 'react'
import styles from './styles'

type Props = {
  user: User
  handleLogin: (userId: string) => void
}

const USERS_FAKE = [
  {
    name: 'User A',
    id: '63b6a3abf3df0fbb77974429'
  },
  {
    name: 'User B',
    id: '63b6a3c8f3df0fbb7797442b'
  },
  {
    name: 'User C',
    id: '63b6a3d7f3df0fbb7797442d'
  },
  {
    name: 'User D',
    id: '63b6a34df3df0fbb77974427'
  }
]

function LoginComponent({ handleLogin, user }: Props) {
  const [userId, setUserId] = useState('')

  const handleChange = (event: SelectChangeEvent<string>) => {
    setUserId(event.target.value)
  }

  const onSubmit = async () => {
    if (userId) {
      handleLogin(userId)
    }
  }

  if (checkIsLogged(user)) {
    return <Navigate to="/" />
  }

  return (
    <Box p={10} sx={styles.wrapper}>
      <Typography sx={styles.title}>Login</Typography>
      <FormControl fullWidth sx={styles.input}>
        <InputLabel sx={styles.subTitle} id="label-user">
          User
        </InputLabel>
        <Select
          labelId="label-user"
          id="demo-simple-select"
          label="User ID"
          onChange={handleChange}
          value={userId}>
          {USERS_FAKE.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <LoadingButton disabled={!userId} onClick={onSubmit} size="medium" variant="contained">
        Submit
      </LoadingButton>
    </Box>
  )
}

export default LoginComponent
