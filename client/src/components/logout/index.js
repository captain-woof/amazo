import LoadingLogo from "../../static/logos/loading_animation.svg"
import Colors from "../../colors"
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useEffect, useState, useContext } from "react"
import { easeInCubicBezier } from "../../utils"
import UserContext from "../../contexts/userContext"
import { useHistory } from 'react-router-dom'

const LogoutContainer = styled(motion.div)`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${Colors.offwhite};
    position: absolute;
    top: 0px;
    left: 0px;
`

const logoutContainerVariant = {
    initial: {
        x: "100vw",
    },
    animate: {
        x: "0vw",
        transition: {
            duration: 1,
            ease: easeInCubicBezier,
        }
    },
    exit: {
        x: "-100vw",
        transition: {
            ease: easeInCubicBezier,
            duration: 1
        }
    }
}

const LoggingOutText = styled(motion.div)`
    font-family: 'raleway';
    font-size: 28px;
    color: ${Colors.black};
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

export default function Logout() {
    // User context
    const { fetchAndSetUserContextState } = useContext(UserContext)

    // History from react router
    const history = useHistory()

    const [statusText, changestatusText] = useState("Logging out...")

    useEffect(() => {
        setTimeout(() => {
            fetch("/api/logout", {
                credentials: "include",
                method: "GET"
            }).then((response) => {
                response.json().then((responseJson) => {
                    if (response.ok) {
                        fetchAndSetUserContextState().then(() => { history.push("/") })
                    } else {
                        changestatusText(responseJson.message)
                        setTimeout(() => {
                            history.push("/")
                        }, 1500)
                    }
                })
            })
        }, 1500)
    }, [fetchAndSetUserContextState, history])

    return (
        <LogoutContainer id="logout-container" variants={logoutContainerVariant} initial="initial"
            animate="animate" exit="exit">
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