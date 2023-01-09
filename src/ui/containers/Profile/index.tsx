import useAuthenticate from 'app/useAuthenticate'
import ProfileComponent from 'ui/components/Profile'

function ProfileContainer() {
  const { user, handleLogout } = useAuthenticate()

  return <ProfileComponent user={user} handleLogout={handleLogout} />
}

export default ProfileContainer
