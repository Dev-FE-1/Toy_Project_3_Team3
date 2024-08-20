import { Link } from 'react-router-dom'
import BtnAddPlaylist from '../components/BtnAddPlaylist'

function Nav() {
	return (
		<nav>
			<ul>
				<li>
					<Link to={'/timeline'}>타임라인</Link>
				</li>
				<li>
					<Link to={'/search'}>탐색</Link>
				</li>
				<li>
					<BtnAddPlaylist />
				</li>
				<li>
					<Link to={'/playlist'}>내 플레이리스트</Link>
				</li>
				<li>
					<Link to={'/mypage'}>마이페이지</Link>
				</li>
			</ul>
		</nav>
	)
}

export default Nav
