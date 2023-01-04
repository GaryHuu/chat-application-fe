import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  box: SxProps
}

const styles: Styles = {
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  box: {
    padding: '5px 10px',
    flex: 1,
    overflowY: 'auto',
  },
}

export default styles
