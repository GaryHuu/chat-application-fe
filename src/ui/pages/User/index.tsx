import useAuthenticate from 'app/useAuthenticate'
import UserComponent from 'ui/components/User'

function UserPage() {
  const { user, handleLogout } = useAuthenticate()

  return <UserComponent user={user} handleLogout={handleLogout} />
}

export default UserPage
