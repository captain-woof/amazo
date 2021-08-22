import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { easeInOutCubicBezier } from "../../utils"
import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import BackgroundImage from "../../static/images/login_register_background.jpg"

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
`

const loginSignupContainerVariant = {
    initial: {
        x: 200,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            when: "beforeChildren",
            duration: 1,
            delayChildren: 0.4,
            staggerChildren: 0.5
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

export default function LoginSignup({ changeIsLoggedIn }) {
    const [isLoginDisplayed, changeIsLoginDisplayed] = useState(true)

    return (
        <LoginSignupContainer id="login-signup-container" variants={loginSignupContainerVariant}
            animate="animate" exit="exit" initial="initial">
            <AnimatePresence initial={false}>
                {isLoginDisplayed ?
                    <Login key="login-container" changeIsLoginDisplayed={changeIsLoginDisplayed}
                        changeIsLoggedIn={changeIsLoggedIn} /> :
                    <Signup key="signup-container" changeIsLoginDisplayed={changeIsLoginDisplayed}
                        changeIsLoggedIn={changeIsLoggedIn} />}
            </AnimatePresence>
        </LoginSignupContainer>
    )
}