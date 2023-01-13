import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  title: SxProps
  value: SxProps
  percentContainer: SxProps
  arrowIncrease: SxProps
  arrowDecrease: SxProps
  percentIncrease: SxProps
  percentDecrease: SxProps
}

const styles: Styles = {
  wrapper: { width: 300 },
  title: { fontWeight: 'bold' },
  value: { fontSize: '40px', margin: '10px 0 0', textAlign: 'center' },
  percentContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  arrowIncrease: { fontSize: '20px', color: '#3BB143' },
  arrowDecrease: { fontSize: '20px', color: '#DC3545' },
  percentIncrease: { fontSize: '20px', textAlign: 'center', color: '#3BB143' },
  percentDecrease: { fontSize: '20px', textAlign: 'center', color: '#DC3545	' }
}

export default styles
