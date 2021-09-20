import styled from "styled-components"
import { motion, useAnimation } from 'framer-motion'
import { easeInCubicBezier } from '../../utils'
import Colors from "../../colors"
import Logo from "./Logo/index"
import HomepageButtons from "./Homepage Buttons/index"
import Ball from "./Ball"
import BackgroundImage from '../../static/images/background.jpg'
import BackgroundCredits from "../common/background-credits"
import { useContext, useEffect } from "react/cjs/react.development"
import IsPhoneContext from "../../contexts/isPhoneContext"

const HomepageContainer = styled(motion.div)`
    height: 100vh;
    width: 100vw;
    background-color: ${Colors.offwhite};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-image: url(${BackgroundImage});
    background-position: ${({isPhone}) => (isPhone ? "0px -400px" : "0px -250px")};
`

const homepageContainerVariant = (isPhone) => ({
    initial: {
        x: "100vw",
    },
    animate: {
        x: "0vw",
        transition: {
            ease: easeInCubicBezier,
            duration: 1,
            delayChildren: 0.4,
            staggerChildren: 0.5,
            when: "beforeChildren"
        }
    },
    exit: {
        x: "-100vw",
        transition: {
            ease: easeInCubicBezier,
            duration: 1
        }
    },
    keep_moving: {
        backgroundPosition: [(isPhone ? "0px -400px" : "0px -250px"), "0px -600px", (isPhone ? "0px -400px" : "0px -250px")],
        transition: {
            duration: 42,
            ease: "linear",
            repeat: Infinity
        }
    }
})

export default function Homepage() {
    const isPhone = useContext(IsPhoneContext)

    // Animating background
    const animation = useAnimation()
    useEffect(() => {
        (async () => {
            await animation.start("animate") // Appear on screen
            animation.start("keep_moving") // Keep animating
        })()        
    }, [animation])

    return (
        <HomepageContainer isPhone={isPhone} id="homepage-container" variants={homepageContainerVariant(isPhone)}
            animate={animation} exit="exit" initial="initial" >
            <BackgroundCredits />
            <Ball />
            <Logo />
            <HomepageButtons />
        </HomepageContainer>
    )
}