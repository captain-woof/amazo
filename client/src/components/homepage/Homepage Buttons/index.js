import styled from "styled-components"
import { motion, AnimateSharedLayout } from 'framer-motion'
import Colors from "../../../colors"
import { easeInOutCubicBezier } from "../../../utils"
import { Link } from "react-router-dom"
import IsPhoneContext from '../../../contexts/isPhoneContext'
import { useContext } from "react"

const ButtonContainer = styled(motion.div)`
    display: flex;
    flex-direction: row;
    background-color: transparent;
    text-align: center;
    width: 100vw;
    justify-content: center;
    z-index: 2;
`

const Button = styled(motion.div)`
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'raleway';
    color: ${Colors.black};
`

const knowMoreButtonVariant = {
    initial: {
        opacity: 0,
        backgroundColor: Colors.offwhite,
        border: `2px solid ${Colors.primary}`
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
        }
    }
}

const loginRegisterButtonVariant = {
    initial: {
        opacity: 0,
        backgroundColor: Colors.primary,
        border: `2px solid ${Colors.primary}`
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
        }
    }
}

export default function HomepageButtons() {
    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    return (
        <AnimateSharedLayout type="crossfade">
            <ButtonContainer layout id="homepage-button-container">
                <Link to="/know_more" style={{ textDecoration: "none" }}>
                    <Button layout whileHover={{
                        backgroundColor: Colors.primaryLight,
                        color: Colors.offwhite,
                        width: (isPhone ? "120px" : "156px"),
                        transition: {
                            duration: 0.6,
                            ease: easeInOutCubicBezier,
                        }
                    }} style={{
                        marginRight: "16px",
                        width: (isPhone ? "96px" : "128px"),
                        fontSize: (isPhone ? "14px" : "16px")
                    }}
                        id="homepage-knowmore-btn" variants={knowMoreButtonVariant}>
                        Know More
                    </Button>
                </Link>
                <Link to="/login_signup" style={{ textDecoration: "none" }}>
                    <Button layout whileHover={{
                        backgroundColor: Colors.primaryDark,
                        border: `2px solid ${Colors.primaryDark}`,
                        width: (isPhone ? "120px" : "156px"),
                        transition: {
                            duration: 0.6,
                            ease: easeInOutCubicBezier,
                        }
                    }} style={{
                        color: Colors.offwhite,
                        width: (isPhone ? "96px" : "128px"),
                        fontSize: (isPhone ? "14px" : "16px")
                    }}
                        id="homepage-login-signup-btn" variants={loginRegisterButtonVariant}>
                        Login/Signup
                    </Button>
                </Link>
            </ButtonContainer>
        </AnimateSharedLayout>
    )
}