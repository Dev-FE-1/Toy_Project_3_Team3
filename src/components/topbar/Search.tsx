import { colors } from '@/styles/colors'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Search as LucideSearch } from 'lucide-react'

function Search() {
	const [isFocus, setIsFocus] = useState(false)
	const [value, setValue] = useState('')
	const handleFocus = () => {
		setIsFocus((prev) => !prev)
	}
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	return (
		<SearchWrap isFocus={isFocus}>
			<div className="inner">
				<input
					title="검색어"
					value={value}
					onFocus={handleFocus}
					onBlur={handleFocus}
					onChange={handleChange}
				/>
				<button type="submit">
					<LucideSearch size="20" />
				</button>
			</div>
		</SearchWrap>
	)
}

export default Search

const SearchWrap = styled.div<{ isFocus: boolean }>`
	width: calc(100% - 660px);
	left: 50%;
	max-width: 400px;
	min-width: 161px;
	position: absolute;
	top: 11px;
	-webkit-transform: translateX(-50%);
	transform: translateX(-50%);
	z-index: 11100;
	@media (min-width: 1200px) {
		width: calc(100% - 930px);
	}

	.inner {
		display: flex;
		height: 38px;
		padding: 0 8px 0 14px;
		border: 1px solid
			${({ isFocus }) => (isFocus ? `rgba(0, 255, 163, 0.5)` : `rgba(255, 255, 255, 0.12)`)};
		border-radius: 20px;
		align-items: center;
	}

	input {
		color: ${colors.veryLightGray};
		flex: 1 1;
		font-size: 15px;
		height: 100%;
		min-width: 0;
		outline: none;
	}

	button {
		color: ${colors.veryLightGray};
	}
`
