import IsPhoneContext from '../../../contexts/isPhoneContext'
import { useContext } from 'react'
import SettingsTab from '../tab/index'
import styled from 'styled-components'
import {secondary} from '../../../colors'

const SettingsTabsContainer = styled.div`
	display: flex;
	flex-direction: ${({isPhone}) => isPhone ? 'row' : 'column'};
	width: ${({isPhone}) => isPhone ? "100%" : "32%"};
	background-color: ${secondary};
	max-width: ${({isPhone}) => (isPhone ? "" : "256px")};
`

export default function SettingsTabs(){
	const isPhone = useContext(IsPhoneContext)
	
	return (
		<SettingsTabsContainer isPhone={isPhone}>
			<SettingsTab settingName='Name' val={0} />
			<SettingsTab settingName='Username' val={1}/>
			<SettingsTab settingName='Email' val={2}/>
			<SettingsTab settingName='Password' val={3}/>
		</SettingsTabsContainer>
	)
}