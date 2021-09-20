import styled from 'styled-components'
import { motion } from 'framer-motion'
import Colors from "../../../colors"
import IsPhoneContext from '../../../contexts/isPhoneContext'
import { useContext } from 'react'

const LogoContainer = styled(motion.div)`
    color: ${Colors.offwhite};
    font-family: 'oswald';
    z-index: 2;
    font-size: ${({isPhone}) => (isPhone ? "64px" : "96px")};
`

const logoContainerVariant = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
}

export default function Logo() {
    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    return (
        <LogoContainer variants={logoContainerVariant} id="homepage-logo" isPhone={isPhone}>
            Brown-Track
        </LogoContainer>
    )
}