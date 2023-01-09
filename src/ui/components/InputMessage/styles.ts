import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  input: SxProps
  uploadIcon: SxProps
  icon: SxProps
}

const styles: Styles = {
  wrapper: {
    height: '70px',
    display: 'flex',
    backgroundColor: '#FFF',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    borderTop: '1px solid #CCC'
  },
  uploadIcon: {
    padding: '5px 10px'
  },
  input: {
    flex: 1,
    padding: '10px'
  },
  icon: { height: '52px' }
}

export default styles
