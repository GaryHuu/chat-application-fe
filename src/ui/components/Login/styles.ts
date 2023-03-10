import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  title: SxProps
  subTitle: SxProps
  input: SxProps
}

const styles: Styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20vh',
    height: '100vh'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: 20
  },
  input: {
    margin: '30px 0 16px',
    width: '300px'
  }
}

export default styles
