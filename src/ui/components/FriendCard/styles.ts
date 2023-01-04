import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  avatar: SxProps
  name: SxProps
}

const styles: Styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #d3d3d3',
    padding: '5px 10px'
  },
  avatar: {
    width: 50,
    height: 50,
    border: '1px solid #d3d3d3',
    margin: '0 20px 0 0'
  },
  name: {
    color: '#251B37'
  }
}

export default styles
