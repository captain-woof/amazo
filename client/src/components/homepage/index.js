import styled from "styled-components"
import { motion } from 'framer-motion'
import { easeInOutCubicBezier } from '../../utils'
import Colors from "../../colors"
import Logo from "./Logo/index"
import HomepageButtons from "./Homepage Buttons/index"
import Ball from "./Ball"

const HomepageContainer = styled(motion.div)`
    height: 100vh;
    width: 100vw;
    background-color: ${Colors.offwhite};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const homepageContainerVariant = {
    initial: {
        x: 200,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            delayChildren: 0.4,
            staggerChildren: 0.5,
            when: "beforeChildren"
        }
    },
    exit: {
        x: -200,
        opacity: 0,
        transition: {
            ease: easeInOutCubicBezier,
            duration: 1
        }
    }
}

export default function Homepage({isPhone}) {
    return (
        <HomepageContainer id="homepage-container" variants={homepageContainerVariant}
            animate="animate" exit="exit" initial="initial" >
            <Ball isPhone={isPhone}/>
            <Logo isPhone={isPhone}/>
            <HomepageButtons isPhone={isPhone}/>
        </HomepageContainer>
    )
}