import { SxProps } from '@mui/material'
import { CSSProperties } from 'react'

type Styles = {
  wrapper: SxProps
  action: SxProps
  actionForward: SxProps
  avatar: SxProps
  left: SxProps
  name: SxProps
  content: SxProps
  triangle: SxProps
  text: SxProps
  status: SxProps
  retryIcon: SxProps
  statusContainer: SxProps
  contentImage: CSSProperties
}

const styles: Styles = {
  wrapper: {
    display: 'flex',
    '&:hover': {
      '.MuiBox-root:first-of-type': {
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
    alignItems: 'flex-end',
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
  left: {
    flex: 1,
    padding: '5px 10px 5px 0',
    maxWidth: 'calc(100% - 50px - 40px)'
  },
  name: { fontWeight: 'bold', textAlign: 'end' },
  content: {
    padding: '8px',
    backgroundColor: '#A8DDFD',
    borderRadius: '5px',
    borderTopRightRadius: '0',
    position: 'relative',
    border: '1px solid #CCC',
    overflow: 'hidden'
  },
  triangle: {
    position: 'absolute',
    top: 0,
    right: '-25px',
    width: 0,
    height: 0,
    borderColor: 'transparent transparent transparent #A8DDFD',
    borderStyle: 'solid',
    borderWidth: '0px 12px 12px 12px'
  },
  text: {
    fontSize: '13px'
  },
  status: {
    fontSize: '13px',
    marginLeft: '5px',
    display: 'flex',
    alignItems: 'center'
  },
  retryIcon: {
    marginLeft: '1px',
    fontSize: '15px',
    color: 'red',
    cursor: 'pointer'
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '4px',
    fontSize: '13px'
  },
  contentImage: {
    width: '100%',
    maxWidth: '500px'
  }
}

export default styles
