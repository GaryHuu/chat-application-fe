import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp'
import ContactsIcon from '@mui/icons-material/Contacts'
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const BOTTOM_NAVIGATION_ACTION = [
  {
    value: '/',
    label: 'Friends',
    icon: <ContactsIcon />,
  },
  {
    value: '/groups',
    label: 'Groups',
    icon: <Groups2SharpIcon />,
  },
  {
    value: '/user',
    label: 'User',
    icon: <AccountCircleSharpIcon />,
  },
]

function MainLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    navigate(value)
  }

  return (
    <Box
      sx={{
        backgroundColor: '#e2e2e2',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          height: 'calc(100vh - 57px)',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </Box>
      <Box
        sx={{
          margin: '0 auto',
          backgroundColor: '#fff',
          height: '56px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          borderTop: '1px solid #CCC',
        }}
      >
        <Box
          sx={{
            margin: '0 auto',
            maxWidth: '500px',
          }}
        >
          <BottomNavigation showLabels value={pathname} onChange={handleChange}>
            {BOTTOM_NAVIGATION_ACTION.map((navigator) => (
              <BottomNavigationAction key={navigator.value} {...navigator} />
            ))}
          </BottomNavigation>
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
