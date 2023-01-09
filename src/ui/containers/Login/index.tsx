import useAuthenticate from 'app/useAuthenticate'
import LoginComponent from 'ui/components/Login'

function LoginContainer() {
  const { user, handleLogin } = useAuthenticate()
  return <LoginComponent user={user} handleLogin={handleLogin} />
}

export default LoginContainer
