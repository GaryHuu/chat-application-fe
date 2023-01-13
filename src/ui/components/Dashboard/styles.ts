import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  numberStatistic: SxProps
  spacing: SxProps
  mostCalledContainer: SxProps
  bold: SxProps
  mostCalledContent: SxProps
}

const styles: Styles = {
  wrapper: {
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#F4F4F4'
  },
  numberStatistic: {
    display: 'flex',
    gap: '20px'
  },
  spacing: {
    marginTop: '10px'
  },
  mostCalledContainer: {
    mt: '5px'
  },
  bold: {
    fontWeight: 'bold'
  },
  mostCalledContent: {
    display: 'flex',
    gap: '10px'
  }
}

export default styles
