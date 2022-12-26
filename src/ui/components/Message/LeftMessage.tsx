import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

type Props = {
  name?: string
  avatarURL?: string
  content?: string
  createdAt?: string
}

function LeftMessage({ name, avatarURL, content, createdAt }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        paddingRight: '50px',
      }}
    >
      <Avatar
        alt={name}
        src={avatarURL}
        sx={{
          width: 40,
          height: 40,
          border: '1px solid #d3d3d3',
        }}
      />
      <Box sx={{ flex: 1, padding: '5px 0 5px 10px' }}>
        <Typography sx={{ fontWeight: 'bold' }}>{name}</Typography>
        <Box
          sx={{
            padding: '8px',
            backgroundColor: '#FFF',
            borderRadius: '5px',
            borderTopLeftRadius: '0',
            position: 'relative',
            border: '1px solid #CCC',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '-25px',
              width: 0,
              height: 0,
              borderColor: 'transparent #FFF transparent transparent',
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
    </Box>
  )
}

export default LeftMessage
