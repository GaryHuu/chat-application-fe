import PrivateRoute from 'app/route/PrivateRoute'
import { RouteObject } from 'react-router-dom'
import Login from 'ui/pages/Login'
import MainLayout from 'ui/components/MainLayout'
import Friends from 'ui/pages/Friends'
import User from 'ui/pages/User'
import Groups from 'ui/pages/Groups'
import Conversation from 'ui/pages/Conversation'

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: <Friends />,
      },
      {
        path: '/conversation/:id',
        element: <Conversation />,
      },
      {
        path: '/groups',
        element: <Groups />,
      },
      {
        path: '/user',
        element: <User />,
      },
    ],
  },
]
