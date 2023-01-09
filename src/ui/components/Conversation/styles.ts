import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  header: SxProps
  backIcon: SxProps
  information: SxProps
  informationName: SxProps
  avatar: SxProps
  box: SxProps
}

const styles: Styles = {
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#FFF',
    borderBottom: '1px solid #CCC',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backIcon: {
    color: '#8e8e8',
    cursor: 'pointer'
  },
  information: {
    display: 'flex',
    alignItems: 'center'
  },
  informationName: {
    marginRight: '10px',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  avatar: {
    height: 50,
    width: 50
  },
  box: {
    padding: '5px 10px',
    flex: 1,
    overflowY: 'auto'
  }
}

export default styles
