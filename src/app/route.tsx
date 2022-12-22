import Login from 'ui/Login'
import PrivateRoute from 'app/PrivateRoute'

export const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <div>Huu</div>
      </PrivateRoute>
    ),
  },
  {
    path: '/conversation/:id',
    element: <div>Conversation</div>,
  },
  {
    path: '/groups',
    element: <div>Group List</div>,
  },
]
