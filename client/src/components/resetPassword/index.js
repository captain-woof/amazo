import CommonHeader from '../common/common-header'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useLocation, useHistory } from 'react-router-dom'
import IsPhoneContext from '../../contexts/isPhoneContext'
import { useContext, useState, useEffect, useCallback } from 'react'
import { offwhite, primary, primaryLight, black } from '../../colors'
import { easeInOutCubicBezier } from '../../utils'
import { showPromiseNotification } from '../common/notification'
import Footer from '../common/footer'

const ResetPasswordContainer = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	flex-direction: column;
`

const Heading = styled.div`
	margin-top: 64px;
	font-family: 'oswald';
	font-size: 24px;
	color: ${black};
`

const Field = styled.input`
	margin-top: 8px;
	width: ${({ isPhone }) => (isPhone ? "75%" : "60%")};
	font-family: 'raleway';
	height: 24px;
`

const Button = styled(motion.div)`
	margin-top: 16px;
	padding: 4px 32px;
	color: ${offwhite};
	background-color: ${primary};
	font-family: 'oswald';
	border-radius: 4px;
	cursor: pointer;
`

const Status = styled.div`
	font-family: 'raleway';
	font-size: 14px;
	margin-top: 42px;
	width: 60%;
	text-align: center;
`

const resetPasswordContainerVariants = {
	initial: {
		x: "100vw",
	},
	animate: {
		x: "0vw",
		transition: {
			when: "beforeChildren",
			duration: 1,
			ease: easeInOutCubicBezier,
		}
	},
	exit: {
		x: "-100vw",
		transition: {
			ease: easeInOutCubicBezier,
			duration: 1
		}
	}
}

const sendResetEmail = async (email, setStatus) => {
	let sendResetEmailPromise = fetch(`/api/sendResetPassword/${email}`, {
		method: "GET"
	})
	showPromiseNotification(sendResetEmailPromise, {
		pendingMsg: "Please wait",
		errorMsg: "An unexpected error occured",
		successMsg: "Done!"
	})

	await sendResetEmailPromise
	setStatus("Check your email (in Spam too) for further instructions! ✅")
}

const setNewPassword = (email, password, key, setStatus, history) => {
	let dataToSend = new FormData()
	dataToSend.append('email', email)
	dataToSend.append('key', key)
	dataToSend.append('newPassword', password)

	let setNewPasswordPromise = new Promise((resolve, reject) => {
		fetch("/api/resetPassword", {
			body: dataToSend,
			method: "POST"
		}).then((resp) => {
			if (resp.ok) {
				resolve("OK")
			} else {
				reject("ERROR")
			}
		})
			.catch((err) => {
				// Do nothing
			})
	})

	showPromiseNotification(setNewPasswordPromise, {
		pendingMsg: "Please wait",
		errorMsg: "Invalid/expired link!",
		successMsg: "Your password has been reset!"
	})

	setNewPasswordPromise.then(() => {
		setStatus("You can now login with your new password! ✅")
	}).catch(() => {
		setStatus("Invalid/expired link! ❌")
	})
	setTimeout(() => { history.push("/") }, 3500)
}

export default function ResetPassword() {
	const location = useLocation()
	const email = location.pathname.split("/")[2]
	const resetKey = location.pathname.split("/")[3]
	const isPhone = useContext(IsPhoneContext)
	const [fieldText, setFieldText] = useState("")
	const [status, setStatus] = useState("")
	const history = useHistory()

	// Handles key press
	const handleKeypress = useCallback((e) => {
		if (e.charCode === 13 || e.keyCode === 13) {
			resetKey
				? setNewPassword(email, fieldText, resetKey, setStatus, history)
				: sendResetEmail(fieldText, setStatus)
		}
	}, [email, fieldText, history, resetKey])

	// Sets up keypress listener
	useEffect(() => {
		window.addEventListener("keypress", handleKeypress)
		return () => { window.removeEventListener("keypress", handleKeypress) }
	}, [handleKeypress])

	// If url is /resetPassword, show input field for email
	// If urls is /resetPassword/EMAIL/KEY, show new password input field
	return (
		<ResetPasswordContainer id="reset-pw-container" variants={resetPasswordContainerVariants} initial='initial'
			animate='animate' exit='exit'>
			<CommonHeader pageTitle='Reset' />
			<Heading id="reset-pw-heading">{resetKey ? "New password" : "Your email"}</Heading>
			<Field id="reset-pw-input-field" isPhone={isPhone} type={resetKey ? 'password' : 'text'}
				placeholder={resetKey ? "Enter new password" : "Enter your email"}
				value={fieldText} onChange={(e) => { setFieldText(e.target.value) }} />
			<Button id="reset-pw-btn" whileHover={{ backgroundColor: primaryLight }}
				onClick={() => {
					resetKey
						? setNewPassword(email, fieldText, resetKey, setStatus, history)
						: sendResetEmail(fieldText, setStatus)
				}
				}>Go</Button>
			<Status id="reset-pw-status">{status}</Status>
			<Footer />
		</ResetPasswordContainer>
	)
}
