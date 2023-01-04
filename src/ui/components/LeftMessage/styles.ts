import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  avatar: SxProps
  right: SxProps
  name: SxProps
  content: SxProps
  triangle: SxProps
  time: SxProps
}

const styles: Styles = {
  wrapper: {
    display: 'flex',
    paddingRight: '50px',
  },
  avatar: {
    width: 40,
    height: 40,
    border: '1px solid #d3d3d3',
  },
  right: { flex: 1, padding: '5px 0 5px 10px' },
  name: { fontWeight: 'bold' },
  content: {
    padding: '8px',
    backgroundColor: '#FFF',
    borderRadius: '5px',
    borderTopLeftRadius: '0',
    position: 'relative',
    border: '1px solid #CCC',
  },
  triangle: {
    position: 'absolute',
    top: 0,
    left: '-25px',
    width: 0,
    height: 0,
    borderColor: 'transparent #FFF transparent transparent',
    borderStyle: 'solid',
    borderWidth: '0px 12px 12px 12px',
  },
  time: {
    fontSize: '12px',
    marginTop: '4px',
    textAlign: 'end',
  },
}

export default styles
