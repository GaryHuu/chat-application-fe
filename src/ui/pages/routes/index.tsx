import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

const MainLayout = lazy(() => import('ui/components/MainLayout'))
const LoginPage = lazy(() => import('ui/pages/Login'))
const UserPage = lazy(() => import('ui/pages/User'))
const FriendsPage = lazy(() => import('ui/pages/Friends'))
const GroupsPage = lazy(() => import('ui/pages/Groups'))
const ConversationPage = lazy(() => import('ui/pages/Conversation'))

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
        path: '/groups',
        element: <GroupsPage />,
      },
      {
        path: '/user',
        element: <UserPage />,
      },
      {
        path: '/conversation/:id',
        element: <ConversationPage />,
      },
    ],
  },
]
