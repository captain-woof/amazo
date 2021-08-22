import styled from 'styled-components'
import { motion } from 'framer-motion'
import Colors from "../../../colors"
import { easeInOutCubicBezier } from "../../../utils"
import Button from "../common/button"
import { useEffect, useState } from 'react'

const LoginContainer = styled(motion.div)`
    background-color: ${Colors.offwhite};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 45%;
    max-width: 320px;
    min-width: 260px;
    position: absolute;
`

const animationTransition = {
    duration: 1,
    ease: easeInOutCubicBezier
}

const loginContainerVariant = {
    initial: {
        opacity: 0,
        y: 200
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: animationTransition
    },
    exit: {
        y: -200,
        opacity: 0,
        transition: animationTransition
    }
}

const Input = styled.input`
    padding: 8px;
    width: 90%;
    margin: 8px;
    box-sizing: border-box;
`

export default function Login({ changeIsLoginDisplayed, changeIsLoggedIn }) {
    // Login request status
    const [status, changeStatus] = useState(null)

    // Helps switch between Login and Logout
    const switchToRegisterHandler = () => {
        changeIsLoginDisplayed(false)
    }

    // When login happens
    const loginHandler = () => {
        fetch("/api/login", {
            body: new FormData(document.querySelector("#login-form")),
            credentials: 'include',
            method: 'POST'
        }).then((response) => {
            response.json().then((respJson) => {
                if (response.ok) {
                    changeStatus(null)
                    changeIsLoggedIn(true)
                    document.location = respJson.redirect
                } else {
                    changeStatus(respJson.message)
                }
            })
        })
    }

    // Login if Enter is pressed
    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            loginHandler()
        }
    }
    useEffect(() => {
        document.addEventListener('keypress', handleKeyPress)
        // Below callback removes the above event listener
        return () => { document.removeEventListener('keypress', handleKeyPress) }
    })

    return (
        <LoginContainer id="login-container" variants={loginContainerVariant}
            initial="initial" animate="animate" exit="exit">
            <div id="login-title" style={{ fontFamily: 'oswald', fontSize: '24px', padding: "16px" }}>
                Log-in to Amazo
            </div>
            <form id="login-form" style={{ textAlign: "center" }}>
                <Input name="email" type="text" placeholder="Email" />
                <Input name="password" type="password" placeholder="Password" />
            </form>
            {!status ? null : <div id="status" style={{
                color: "red",
                fontFamily: "raleway",
                fontSize: "12px",
                alignSelf: "flex-end",
                marginRight: "16px"
            }}>
                {status}
            </div>}

            <motion.div id="signup-button"
                style={{
                    margin: "8px",
                    width: "90%",
                    userSelect: "none",
                    color: Colors.blackSecondary,
                    cursor: "pointer",
                    fontFamily: "oswald"
                }}
                whileHover={{ color: Colors.greenDarkPrimary }}
                onClick={switchToRegisterHandler}>
                Don't have an account yet?
            </motion.div>
            <Button id="login-button" buttonText="Login" onClickHandler={loginHandler}
                style={{ alignSelf: "flex-end", margin: "8px 16px 8px 0px" }} />
            <div id="forgot-password" style={{
                alignSelf: "flex-end",
                margin: "-4px 16px 8px 8px",
                userSelect: "none",
                paddingBottom: "4px"
            }}>
                <motion.a href="/forgot_password" style={{
                    textDecoration: "none",
                    fontFamily: "raleway",
                    fontSize: "12px",
                    color: Colors.blackSecondary
                }} whileHover={{ color: Colors.greenDarkPrimary }}>
                    Forgot password?
                </motion.a>
            </div>
        </LoginContainer>
    )
}