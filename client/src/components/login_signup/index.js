import styled from 'styled-components'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { easeInCubicBezier } from "../../utils"
import { useState, useEffect } from 'react'
import Login from './Login/index'
import Signup from './Signup/index'
import BackgroundImage from "../../static/images/background.jpg"
import BackgroundCredits from '../common/background-credits'
import { useContext } from 'react'
import IsPhoneContext from '../../contexts/isPhoneContext'

const LoginSignupContainer = styled(motion.div)`
    width: 100vw;
    height: 100vh;
    background-image: url(${BackgroundImage});
    background-repeat: no-repeat;
    background-position: center -120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-position: ${({isPhone}) => (isPhone ? "0px -400px" : "0px -250px")};
`

const loginSignupContainerVariant = (isPhone) => ({
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

export default function LoginSignup() {
    const [isLoginDisplayed, changeIsLoginDisplayed] = useState(true)
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
        <LoginSignupContainer isPhone={isPhone} id="login-signup-container" variants={loginSignupContainerVariant(isPhone)} animate={animation} exit="exit" initial="initial">
            <BackgroundCredits/>
            <AnimatePresence initial={false}>
                {isLoginDisplayed ?
                    <Login key="login-container" changeIsLoginDisplayed={changeIsLoginDisplayed} /> :
                    <Signup key="signup-container" changeIsLoginDisplayed={changeIsLoginDisplayed} />}
            </AnimatePresence>
        </LoginSignupContainer>
    )
}