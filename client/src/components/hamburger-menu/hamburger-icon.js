import styled from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import Colors from "../../colors"
import { easeOutCubicBezier, easeInOutCubicBezier } from "../../utils"
import { useEffect } from 'react'

const HamburgerIconContainer = styled(motion.div)`
    position: absolute;
    top: 12px;
    right: 16px;
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
        fill: Colors.offwhite
    },
    offToOn: {
        fill: Colors.greenPrimary,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    },
    onToOff: {
        fill: Colors.offwhite,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    }
}

const iconContainerAnimationVariants = {
    initial: {
        rotateZ: "-60deg",
        opacity: 0,
        x: -50,
        backgroundColor: Colors.greenPrimary
    },
    animate: {
        rotateZ: "0deg",
        opacity: 1,
        x: 0,
        transition: {
            ease: easeInOutCubicBezier,
            delay: 2.8,
            duration: 1
        }
    },
    offToOn: {
        rotateZ: "-180deg",
        backgroundColor: Colors.offwhite,
        transition: {
            ease: easeOutCubicBezier,
            duration: 1
        }
    },
    onToOff: {
        rotateZ: "0deg",
        backgroundColor: Colors.greenPrimary,
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

    const toggleMenuHandler = () => {
        changeIsMenuActivated(!isMenuActivated)
    }

    useEffect(() => {
        animation.start("animate")
    }, [animation])

    useEffect(() => {
        if (isMenuActivated) {
            animation.start("offToOn")
        } else {
            animation.start("onToOff")
        }
    }, [isMenuActivated, animation])

    return (
        <HamburgerIconContainer id="hamburger-icon-container" variants={iconContainerAnimationVariants} animate={animation} whileTap="whileTap" initial="initial" onClick={toggleMenuHandler}>
            <motion.svg height="24px" id="hamburger-icon" version="1.0" viewBox="0 0 32 32" width="24px" animate={animation} variants={iconAnimationVariants} initial="initial" style={{ marginLeft: "-1px" }}>
                <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
            </motion.svg>
        </HamburgerIconContainer>
    )
}