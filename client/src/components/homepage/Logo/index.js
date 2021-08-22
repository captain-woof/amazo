import styled from 'styled-components'
import { motion } from 'framer-motion'
import Colors from "../../../colors"

const LogoContainer = styled(motion.div)`
    color: ${Colors.blackSecondary};
    font-family: 'oswald';
    z-index: 2;
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

export default function Logo({ isPhone }) {
    return (
        <LogoContainer variants={logoContainerVariant} id="homepage-logo"
            style={{
                fontSize: (isPhone ? "84px" : "128px")
            }}>
            Amazo
        </LogoContainer>
    )
}