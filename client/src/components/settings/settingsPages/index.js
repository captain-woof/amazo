import { useContext, useState } from 'react'
import styled from 'styled-components'
import IsPhoneContext from '../../../contexts/isPhoneContext'
import TabSelectedContext from '../tabSelectedContext'
import CurrentPassword from './currentPassword'
import ChangeField from './changeField'
import Button from './button'
import { Link } from 'react-router-dom'
import { offwhite, primary } from '../../../colors'

const SettingPageContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	height: ${({ isPhone }) => (isPhone ? "calc(100vh - 188px)" : "calc(100vh - 180px)")};
	align-items: center;
	justify-content: center;
`

const getDeleteAccountStyle = (isPhone) => ({
	position: 'absolute',
	bottom: '16px',
	right: (isPhone ? null : "32px"),
	textDecoration: 'none',
	fontFamily: 'raleway',
	fontSize: "14px",
	color: offwhite,
	backgroundColor: primary,
	padding: '8px 16px',
	cursor: 'pointer',
	userSelect: 'none'
})

export default function SettingsPage() {
	const { tabSelectedIndex } = useContext(TabSelectedContext)
	const isPhone = useContext(IsPhoneContext)

	const settingsPageNames = ['name', 'username', 'email', 'password']

	const [currentPassword, setCurrentPassword] = useState("")
	const [fieldText, setFieldText] = useState("")

	return (
		<SettingPageContainer isPhone={isPhone}>
			<CurrentPassword currentPassword={currentPassword} setCurrentPassword={setCurrentPassword} />
			<ChangeField type={tabSelectedIndex === 3 ? "password" : "text"} fieldText={fieldText} setFieldText={setFieldText}
				fieldName={settingsPageNames[tabSelectedIndex]} />
			<Button currentPassword={currentPassword} fieldText={fieldText}
				fieldName={settingsPageNames[tabSelectedIndex]} />
			<Link to='/deleteAccount' style={getDeleteAccountStyle(isPhone)}>Delete account</Link>
		</SettingPageContainer>
	)
}