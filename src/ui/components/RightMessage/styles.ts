import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  avatar: SxProps
  left: SxProps
  name: SxProps
  content: SxProps
  triangle: SxProps
  time: SxProps
}

const styles: Styles = {
  wrapper: {
    display: 'flex',
    paddingLeft: '50px',
  },
  avatar: {
    width: 40,
    height: 40,
    border: '1px solid #d3d3d3',
  },
  left: { flex: 1, padding: '5px 10px 5px 0' },
  name: { fontWeight: 'bold', textAlign: 'end' },
  content: {
    padding: '8px',
    backgroundColor: '#A8DDFD',
    borderRadius: '5px',
    borderTopRightRadius: '0',
    position: 'relative',
    border: '1px solid #CCC',
  },
  triangle: {
    position: 'absolute',
    top: 0,
    right: '-25px',
    width: 0,
    height: 0,
    borderColor: 'transparent transparent transparent #A8DDFD',
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
