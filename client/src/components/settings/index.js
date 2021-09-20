import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { offwhite } from '../../colors'
import { easeInOutCubicBezier } from '../../utils'
import CommonHeader from '../common/common-header'
import IsPhoneContext from '../../contexts/isPhoneContext'
import SettingsTabs from './tabs/index'
import SettingsPage from './settingsPages/index'
import TabSelectedContext from './tabSelectedContext'
import Footer from '../common/footer'

const SettingsContainer = styled(motion.div)`
	width: 100vw;
	height: 100vh;
	background-color: ${offwhite};
	position: absolute;
	top: 0;
	left: 0;
`

const SettingsTabsAndEleContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: ${({ isPhone }) => (isPhone ? 'column' : 'row')};
`

const settingsContainerVariant = {
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

export default function Settings() {
	const [tabSelectedIndex, setTabSelectedIndex] = useState(0)
	const isPhone = useContext(IsPhoneContext)

	return (
		<TabSelectedContext.Provider value={{ tabSelectedIndex, setTabSelectedIndex }}>
			<SettingsContainer variants={settingsContainerVariant} initial='initial'
				animate='animate' exit='exit'>
				<CommonHeader pageTitle='Settings' />
				<SettingsTabsAndEleContainer isPhone={isPhone}>
					<SettingsTabs />
					<SettingsPage />
				</SettingsTabsAndEleContainer>
				<Footer />
			</SettingsContainer>
		</TabSelectedContext.Provider>
	)
}
