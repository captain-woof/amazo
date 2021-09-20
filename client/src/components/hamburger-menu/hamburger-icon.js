import styled from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import { offwhite, primaryLight, secondary, white } from "../../colors"
import { easeOutCubicBezier, easeInOutCubicBezier } from "../../utils"
import { useEffect, useState } from 'react'

const HamburgerIconContainer = styled(motion.div)`
    position: absolute;
    top: 12px;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 4;
`

const iconAnimationVariants = {
    initial: {
        fill: white,
    },
    offToOn: {
        fill: offwhite,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    },
    onToOff: {
        fill: white,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    }
}

const iconContainerAnimationVariants = {
    initial: {
        opacity: 0,
        rotateZ: -70,
        right: '72px',
        backgroundColor: secondary
    },
    animate: {
        opacity: 1,
        rotateZ: 0,
        right: '12px',
        transition: {
            ease: easeInOutCubicBezier,
            delay: 2.3,
            duration: 1.5
        }
    },
    offToOn: {
        rotateZ: -180,
        backgroundColor: primaryLight,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    },
    onToOff: {
        rotateZ: 0,
        backgroundColor: secondary,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    },
    whileTap: {
        scale: 0.9,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    }
}

export default function HamburgerIcon({ isMenuActivated, changeIsMenuActivated }) {
    const animation = useAnimation()
    const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false)

    const toggleMenuHandler = () => {
        changeIsMenuActivated(!isMenuActivated)
    }

    useEffect(() => {
        (async () => {
            await animation.start("animate")
            setIsInitialAnimationComplete(true)
        })()
    }, [animation])

    useEffect(() => {
        if (isMenuActivated) {
            animation.start("offToOn")
        } else {
            isInitialAnimationComplete && animation.start("onToOff")
        }
    }, [isMenuActivated, animation, isInitialAnimationComplete])

    return (
        <HamburgerIconContainer id="hamburger-icon-container" variants={iconContainerAnimationVariants} animate={animation} whileTap="whileTap" initial="initial" onClick={toggleMenuHandler}>
            <motion.svg height="24px" id="hamburger-icon" version="1.0" viewBox="0 0 32 32" width="24px" animate={animation} variants={iconAnimationVariants} initial="initial" style={{ marginLeft: "-1px" }}>
                <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
            </motion.svg>
        </HamburgerIconContainer>
    )
}