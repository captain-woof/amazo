import { motion, useAnimation } from 'framer-motion'
import { useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { primary, primaryDark, offwhite } from '../../../colors'
import { easeInOutCubicBezier } from '../../../utils'
import IsPhoneContext from '../../../contexts/isPhoneContext'
import TabSelectedContext from '../tabSelectedContext'

const SettingsTabContainer = styled(motion.div)
`
	width: ${({isPhone}) => (isPhone ? '25%': '100%')};
	height: ${({isPhone}) => (isPhone ? '48px': 'calc((100vh - 180px)/4)')};
	color: ${offwhite};
	font-family: 'raleway';
	font-size: ${({isPhone}) => (isPhone ? '14px' : '24px')};
	user-select: none;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${primary};
	font-weight: ${({isPhone}) => (isPhone ? 'bold' : 'normal')};
`

const variantsTransition = {
	ease: easeInOutCubicBezier,
	duration: 0.5
}

export default function SettingsTab({ val, settingName }) {
	
	const isPhone = useContext(IsPhoneContext)	
	const {tabSelectedIndex, setTabSelectedIndex} = useContext(TabSelectedContext)
	const [isSelected, setIsSelected] = useState(val === tabSelectedIndex)
	const selectAnimation = useAnimation()

	const settingsTabVariants = useMemo(() => ({
		initial: {
			backgroundColor: primaryDark,
			transition: variantsTransition
		},
		whileHover: {
			backgroundColor: primary,
			transition: variantsTransition
		},
		whileTap: {
			backgroundColor: '#ffffff',
			color: '#212121',
			transition: variantsTransition
		},
		select: {
			x: (isPhone ? '0px' : '-16px'),
			y: (isPhone ? '-4px' : '0px'),
			transition: variantsTransition
		},
		deselect: {
			x: '0px',
			y: '0px',
			transition: variantsTransition
		}
	}), [isPhone])


	useEffect(() => {
		setIsSelected(val === tabSelectedIndex)
	}, [tabSelectedIndex, val])

	useEffect(() => {
		isSelected ? selectAnimation.start('select') : selectAnimation.start('deselect')
	}, [isSelected, selectAnimation])

	return (
		<SettingsTabContainer animate={selectAnimation} variants={settingsTabVariants}
		initial='initial' whileHover='whileHover' whileTap='whileTap' isPhone={isPhone}
		onClick={() => {setTabSelectedIndex(val)}}> 
			<div style={{margin: '8px', height: 'max-content'}}>{settingName}</div>
		</SettingsTabContainer>
	)
}
