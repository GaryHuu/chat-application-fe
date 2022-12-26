import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

type Props = {
  name?: string
  avatarURL?: string
  content?: string
  createdAt?: string
  isOwner?: boolean
}

function RightMessage({
  name,
  avatarURL,
  content,
  createdAt,
  isOwner = true,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        paddingLeft: '50px',
      }}
    >
      <Box sx={{ flex: 1, padding: '5px 10px 5px 0' }}>
        <Typography sx={{ fontWeight: 'bold', textAlign: 'end' }}>
          {isOwner ? 'You' : name}
        </Typography>
        <Box
          sx={{
            padding: '8px',
            backgroundColor: '#A8DDFD',
            borderRadius: '5px',
            borderTopRightRadius: '0',
            position: 'relative',
            border: '1px solid #CCC',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: '-25px',
              width: 0,
              height: 0,
              borderColor: 'transparent transparent transparent #A8DDFD',
              borderStyle: 'solid',
              borderWidth: '0px 12px 12px 12px',
            }}
          />
          {content}
          <Typography
            sx={{
              fontSize: '12px',
              marginTop: '4px',
              textAlign: 'end',
            }}
          >
            {dayjs(createdAt).format('h:mm A')}
          </Typography>
        </Box>
      </Box>
      <Avatar
        alt={name}
        src={avatarURL}
        sx={{
          width: 40,
          height: 40,
          border: '1px solid #d3d3d3',
        }}
      />
    </Box>
  )
}

export default RightMessage
