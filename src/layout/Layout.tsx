/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Navbar from '@/layout/nav/Navbar'
import Logo from '@/components/Logo'
import useResponsiveNav from '@/hooks/useResponsivNav'
import useNavStore from '@/stores/useNavStore'
import { Outlet } from 'react-router-dom'
import Header from '@/layout/header/Header'

function Layout() {
	const isExpand = useNavStore((state) => state.isExpand)
	useResponsiveNav()
	return (
		<div css={wrap} className="wrap">
			<Header />
			<Navbar />
			<Logo />
			<div css={container(isExpand)} className="container">
				<Outlet />
			</div>
		</div>
	)
}
export default Layout

const wrap = css`
	min-height: 100vh;
	min-width: 950px;
`

const container = (isExpand: boolean) => css`
	padding-top: 60px;
	padding-left: ${isExpand ? '240px' : '78px'};
	min-height: 100vh;
	box-sizing: border-box;
`
