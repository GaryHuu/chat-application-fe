import PrivateRoute from 'app/route/PrivateRoute'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import MainLayout from 'ui/components/MainLayout'

const LoginPage = lazy(() => import('ui/pages/Login'))
const FriendsPage = lazy(() => import('ui/pages/Friends'))
const ConversationPage = lazy(() => import('ui/pages/Conversation'))
const GroupsPage = lazy(() => import('ui/pages/Groups'))
const UserPage = lazy(() => import('ui/pages/User'))

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
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
        element: <FriendsPage />,
      },
      {
        path: '/conversation/:id',
        element: <ConversationPage />,
      },
      {
        path: '/groups',
        element: <GroupsPage />,
      },
      {
        path: '/user',
        element: <UserPage />,
      },
    ],
  },
]
