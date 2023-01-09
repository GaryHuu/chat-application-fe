import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  title: SxProps
  subtitle: SxProps
  list: SxProps
  action: SxProps
  actionCancel: SxProps
  actionSent: SxProps
  name: SxProps
  avatar: SxProps
}

const styles: Styles = {
  wrapper: {
    width: '350px',
    padding: '10px 12px'
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: '18px',
    padding: '5px 0'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '126px',
    overflowY: 'auto'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '10px 0 5px'
  },
  action: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  actionCancel: {
    marginRight: '10px',
    width: '100px'
  },
  actionSent: {
    width: '100px'
  },
  name: { display: 'flex', alignItems: 'center' },
  avatar: {
    marginRight: '5px',
    width: 30,
    height: 30
  }
}

export default styles
