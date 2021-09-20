import styled from 'styled-components'
import { motion } from 'framer-motion'
import { primary, primaryDark, offwhite } from '../../colors'
import { useCallback, useContext, useEffect, useState } from 'react'
import { showNotification } from '../common/notification'
import UserContext from '../../contexts/userContext'
import { useHistory } from 'react-router-dom'

const ButtonOuterContainer = styled.div`
	width: 100vw;
	margin-top: 20px;
	display: flex;
	justify-content: center;
	flex-direction: row;
	justify-content: center;
`

const ButtonContainer = styled(motion.div)`
	background-color: ${primary};
	font-family: 'oswald';
	font-size: 16px;
	color: ${offwhite};
	height: max-content;
	width: max-content;
	border-radius: 4px;
	user-select: none;
	cursor: pointer;
	padding: 4px 8px 6px 8px;
	opacity: ${({ pendingState }) => (pendingState ? 0.8 : 1)};
	display: flex;
	justify-content: center;
`

const buttonVariants = {
	whileHover: {
		backgroundColor: primaryDark
	}
}

export default function Button({ password }) {
	const [pendingState, setPendingState] = useState(false)
	const { fetchAndSetUserContextState } = useContext(UserContext)
	const history = useHistory()

	const handleAction = useCallback(async () => {
		setPendingState(true)
		let reqBody = new FormData()
		reqBody.append("password", password)

		try {
			let response = await fetch('/api/deleteAccount', {
				credentials: 'include',
				method: 'POST',
				body: reqBody
			})
			if (response.ok) {
				showNotification("Your account is deleted!", 'success')
				fetchAndSetUserContextState()
				history.push('/')
			} else {
				response.json()
					.then((respJson) => {
						showNotification(respJson.message, 'error')
					})
			}
		} catch (e) {
			showNotification(e, 'error')
		}
		setPendingState(false)
	}, [password, fetchAndSetUserContextState, history])

	const enterKeyHandler = useCallback((e) => {
		if (e.charCode === 13 || e.keyCode === 13) {
			handleAction()
		}
	}, [handleAction])

	useEffect(() => {
		window.addEventListener('keypress', enterKeyHandler)
		return () => { window.removeEventListener('keypress', enterKeyHandler) }
	}, [enterKeyHandler])

	return (
		<ButtonOuterContainer >
			<ButtonContainer pendingState={pendingState} variants={buttonVariants} whileHover='whileHover'
				onClick={handleAction}>
				Change
			</ButtonContainer>
		</ButtonOuterContainer>
	)
}
