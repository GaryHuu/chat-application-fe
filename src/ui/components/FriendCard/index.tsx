import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type Props = {
  name: string
  avatarURL?: string
}

function FriendCard({ name, avatarURL }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #d3d3d3',
        padding: '5px 10px',
      }}
    >
      <Avatar
        alt={name}
        src={avatarURL}
        sx={{
          width: 50,
          height: 50,
          border: '1px solid #d3d3d3',
          margin: '0 20px 0 0',
        }}
      />
      <Typography
        sx={{
          color: '#251B37',
        }}
        variant='h6'
      >
        {name}
      </Typography>
    </Box>
  )
}

export default FriendCard
