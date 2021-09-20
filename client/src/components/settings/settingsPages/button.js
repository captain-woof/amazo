import styled from 'styled-components'
import { motion } from 'framer-motion'
import { primary, primaryDark, offwhite } from '../../../colors'
import IsPhoneContext from '../../../contexts/isPhoneContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import { showNotification } from '../../common/notification'
import UserContext from '../../../contexts/userContext'

const ButtonOuterContainer = styled.div `
	width: 50%;
	max-width: 350px;
	min-width: 220px;
	margin-top: 20px;
	display: flex;
	flex-direction: row;
	justify-content: ${({isPhone}) => (isPhone ? "center" : "flex-end")};
`

const ButtonContainer = styled(motion.div)
`
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
	opacity: ${({pendingState}) => (pendingState ? 0.8 : 1)};
`

const buttonVariants = {
	whileHover: {
		backgroundColor: primaryDark
	}
}



export default function Button({ fieldName, currentPassword, fieldText }) {
	const isPhone = useContext(IsPhoneContext)
	const { fetchAndSetUserContextState } = useContext(UserContext)
	const [pendingState, setPendingState] = useState(false)

	const changeUserInfo = useCallback(async () => {
		setPendingState(true)

		let reqBody = new FormData()
		reqBody.append("currentPassword", currentPassword)
		reqBody.append("fieldText", fieldText)

		try {
			let response = await fetch(`/api/changeUserDetails/${fieldName}`, {
				credentials: 'include',
				method: 'POST',
				body: reqBody
			})
			if (response.ok) {
				showNotification("Successfully changed!", 'success')
				fetchAndSetUserContextState()
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
	}, [currentPassword, fetchAndSetUserContextState, fieldName, fieldText])

	const enterKeyHandler = useCallback((e) => {
		if (e.charCode === 13 || e.keyCode === 13) {
				changeUserInfo()
		}
	}, [changeUserInfo])

	useEffect(() => {
		window.addEventListener('keypress', enterKeyHandler)
		return () => { window.removeEventListener('keypress', enterKeyHandler) }
	}, [changeUserInfo, enterKeyHandler])

	return (
		<ButtonOuterContainer isPhone={isPhone}>
			<ButtonContainer pendingState={pendingState} variants={buttonVariants} whileHover='whileHover'
				onClick={changeUserInfo}>
				Change
			</ButtonContainer>
		</ButtonOuterContainer>
	)
}
