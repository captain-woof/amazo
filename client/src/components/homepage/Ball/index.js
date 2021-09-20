import styled from "styled-components"
import { motion } from 'framer-motion'
import Colors from "../../../colors"
import { easeInOutCubicBezier } from "../../../utils"
import IsPhoneContext from '../../../contexts/isPhoneContext'
import { useContext } from "react"

const AnimatingBall = styled(motion.div)`
    position: absolute;
    background-color: ${Colors.primaryLight};
    border-radius: 50%;
    z-index: 1;
`

const animatingBallVariant = {
    initial: {
        opacity: 0,
        x: -200,
        scale: 0.9
    },
    animate: {
        opacity: 1,
        x: 64,
        scale: 1.1,
        transition: {
            duration: 1.3,
            ease: easeInOutCubicBezier
        }
    }
}

export default function Ball() {
    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    return (
        <AnimatingBall variants={animatingBallVariant} id="homepage-animating-ball"
        style={{
            height: (isPhone ? "180px" : "200px"),
            width: (isPhone ? "180px" : "200px")
        }}/>
    )
}