import { SxProps } from '@mui/material'

type Styles = {
  wrapper: SxProps
  header: SxProps
  backIcon: SxProps
  information: SxProps
  informationName: SxProps
  background: SxProps
  avatar: SxProps
  box: SxProps
  loading: SxProps
  scrollDownIcon: SxProps
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
    overflowY: 'auto',
    position: 'relative'
  },
  loading: {
    textAlign: 'center'
  },
  background: {
    position: 'absolute',
    inset: '100px 0px 250px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    filter: 'blur(20px)',
    WebkitFilter: 'blur(20px)'
  },
  scrollDownIcon: {
    position: 'fixed',
    right: '25px',
    bottom: '145px',
    height: '30px',
    width: '30px',
    borderRadius: '50%',
    border: '1px solid #CCC',
    backgroundColor: '#FFF',
    textAlign: 'center',
    paddingTop: '2px',
    cursor: 'pointer',

    '&:hover': {
      opacity: '0.7'
    }
  }
}

export default styles
