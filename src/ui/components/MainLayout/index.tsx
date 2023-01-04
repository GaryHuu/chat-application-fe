import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp'
import ContactsIcon from '@mui/icons-material/Contacts'
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './styles'

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
    <Box sx={styles.wrapper}>
      <Box sx={styles.content}>
        <Outlet />
      </Box>
      <Box sx={styles.bottom}>
        <Box sx={styles.navList}>
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
