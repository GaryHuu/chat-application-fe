import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  content: SxProps
  bottom: SxProps
  navList: SxProps
}

const styles: Styles = {
  wrapper: {
    backgroundColor: '#e2e2e2',
    height: '100vh'
  },
  content: {
    height: 'calc(100vh - 57px)',
    overflowY: 'auto'
  },
  bottom: {
    margin: '0 auto',
    backgroundColor: '#fff',
    height: '56px',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    borderTop: '1px solid #CCC'
  },
  navList: {
    margin: '0 auto',
    maxWidth: '500px'
  }
}

export default styles
