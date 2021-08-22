import LoadingLogo from "../../static/logos/loading_animation.svg"
import Colors from "../../colors"
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useEffect, useState } from "react"

const LogoutContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${Colors.offwhite};
`

const LoggingOutText = styled(motion.div)`
    font-family: 'raleway';
    font-size: 28px;
    color: ${Colors.blackSecondary};
    margin-left: 16px;
`

const loggingOutTextVariant = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: [0, 1, 0],
        transition: {
            duration: 2,
            repeat: Infinity
        }
    }
}

export default function Logout({ changeIsLoggedIn }) {
    const [statusText, changestatusText] = useState("Logging out...")

    useEffect(() => {
        setTimeout(() => {
            fetch("/api/logout", {
                credentials: "include",
                method: "GET"
            }).then((response) => {
                response.json().then((responseJson) => {
                    if (response.ok) {
                        changeIsLoggedIn(false)
                        document.location = responseJson.redirect
                    } else {
                        changestatusText(responseJson.message)
                        setTimeout(() => {
                            document.location = responseJson.redirect
                        }, 1500)
                    }
                })
            })
        }, 1500)
    }, [changeIsLoggedIn])

    return (
        <LogoutContainer id="logout-container">
            <img id="loading-logo" src={LoadingLogo} alt="Loading animation" style={{
                width: "100px",
                height: "100px"
            }} />
            <LoggingOutText id="logging-out-text" initial="initial" animate="animate"
                variants={loggingOutTextVariant}>
                {statusText}
            </LoggingOutText>
        </LogoutContainer>
    )
}