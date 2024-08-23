/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import { colors } from '@/styles/colors'
import { X } from 'lucide-react'
import useSignModalStore from '@/store/useSignModalStore'

interface SignModalProps {
	jsx: React.ReactNode
	modalName: string
}

const SignModal = ({ jsx, modalName }: SignModalProps) => {
	const closeSignModal = useSignModalStore((state) => state.closeModal)

	return (
		<div css={wrapper}>
			<div css={loginModalArea}>
				<button css={closeBtn} onClick={() => closeSignModal(modalName)}>
					<X css={{ color: '#888' }} />
				</button>
				{jsx}
			</div>
		</div>
	)
}

export default SignModal

const wrapper = css`
	margin: 0;
	top: 0;
	left: 0;
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
`
const loginModalArea = css`
	position: relative;
	width: 480px;
	display: flex;
	flex-direction: column;
	background-color: #1d1d1d;
	border-radius: 15px;
	color: ${colors.white};
	display: flex;
	align-items: center;
`
const closeBtn = css`
	position: absolute;
	right: 0;
	background-color: transparent;
	border: none;
	outline: none;
	padding: 10px;
	cursor: pointer;
`
