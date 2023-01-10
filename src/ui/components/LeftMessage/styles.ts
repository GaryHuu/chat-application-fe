import { SxProps } from '@mui/material'
import { CSSProperties } from 'react'

type Styles = {
  wrapper: SxProps
  action: SxProps
  actionForward: SxProps
  avatar: SxProps
  right: SxProps
  name: SxProps
  content: SxProps
  triangle: SxProps
  time: SxProps
  contentImage: CSSProperties
}

const styles: Styles = {
  wrapper: {
    display: 'flex',
    '&:hover': {
      '.MuiBox-root:last-of-type': {
        opacity: 1,
        visibility: 'visible'
      }
    }
  },
  action: {
    width: '50px',
    padding: '30px 5px 5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    opacity: 0,
    visibility: 'hidden'
  },
  actionForward: {
    fontSize: '18px',
    cursor: 'pointer',
    color: '#8e8e8e'
  },
  avatar: {
    width: 40,
    height: 40,
    border: '1px solid #d3d3d3'
  },
  right: { flex: 1, padding: '5px 0 5px 10px', maxWidth: 'calc(100% - 50px - 40px)' },
  name: { fontWeight: 'bold' },
  content: {
    padding: '8px',
    backgroundColor: '#FFF',
    borderRadius: '5px',
    borderTopLeftRadius: '0',
    position: 'relative',
    border: '1px solid #CCC',
    overflow: 'hidden'
  },
  triangle: {
    position: 'absolute',
    top: 0,
    left: '-25px',
    width: 0,
    height: 0,
    borderColor: 'transparent #FFF transparent transparent',
    borderStyle: 'solid',
    borderWidth: '0px 12px 12px 12px'
  },
  time: {
    fontSize: '12px',
    marginTop: '4px',
    textAlign: 'end'
  },
  contentImage: {
    height: '200px'
  }
}

export default styles
