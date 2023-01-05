import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  avatar: SxProps
  name: SxProps
  wrapperIcon: SxProps
}

const styles: Styles = {
  wrapper: {
    padding: '20px',
    display: 'flex',
    marginTop: '20vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 100,
    height: 100,
    border: '1px solid #d3d3d3'
  },
  name: {
    marginTop: '10px',
    color: '#424242'
  },
  wrapperIcon: {
    width: '200px',
    display: 'flex',
    justifyContent: 'center'
  }
}

export default styles
