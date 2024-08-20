import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/ErrorPage'
import Layout from '../layout/Layout'
import Search from '../pages/Search'
import Playlist from '../pages/Playlist'
import Mypage from '../pages/Mypage'
import Timeline from '../pages/Timeline'
import Login from '../pages/Login'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/timeline',
				element: <Timeline />,
			},
			{
				path: '/search',
				element: <Search />,
			},
			{
				path: '/playlist',
				element: <Playlist />,
			},
			{
				path: '/mypage',
				element: <Mypage />,
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
	},
])
