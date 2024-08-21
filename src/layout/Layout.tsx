import { Outlet, useNavigate } from 'react-router-dom'
import Nav from './Nav'
import { useEffect } from 'react'
import Header from './Header'

const getUser = async () => {
	// const user = await user()
	const user = true
	return user
}

function Layout() {
	const navigate = useNavigate()

	useEffect(() => {
		const loginCheck = async () => {
			const isLogin = await getUser()
			if (isLogin) {
				navigate('/timeline')
			} else {
				navigate('/login')
			}
		}

		loginCheck()
	}, [navigate])

	return (
		<div className="layout">
			<Header />
			<Nav />
			<div className="container">
				<Outlet />
			</div>
		</div>
	)
}
export default Layout
