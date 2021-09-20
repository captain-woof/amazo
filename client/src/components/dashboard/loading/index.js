import LoadingLogo from "../../../static/logos/loading_animation.svg"
import Colors from "../../../colors"
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { easeInCubicBezier } from "../../../utils"

const LoadingContainer = styled(motion.div)`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${Colors.offwhite};
    position: relative;
`

const loadingContainerVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: easeInCubicBezier,
        }
    },
    exit: {
        opacity: 0,
        transition: {
            ease: easeInCubicBezier,
            duration: 1
        }
    }
}

const LoadingText = styled(motion.div)`
    font-family: 'raleway';
    font-size: 28px;
    color: ${Colors.black};
    margin-left: 16px;
`

const loadingTextVariant = {
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

export default function Loading({ statusText }) {
    return (
        <LoadingContainer id="loading-container" variants={loadingContainerVariant} initial="initial"
            animate="animate" exit="exit">
            <img id="loading-logo" src={LoadingLogo} alt="Loading animation" style={{
                width: "100px",
                height: "100px"
            }} />
            <LoadingText id="loading-text" initial="initial" animate="animate"
                variants={loadingTextVariant}>
                {statusText}
            </LoadingText>
        </LoadingContainer>
    )
}