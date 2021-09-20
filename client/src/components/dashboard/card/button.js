import styled from 'styled-components'
import { motion } from 'framer-motion'
import Colors from "../../../colors"
import { easeInOutCubicBezier } from '../../../utils'

const ButtonContainer = styled(motion.div)`
    width: max-content;
    height: 20px;
    background-color: ${Colors.primary};
    border-radius: 4px;
    padding: 4px 8px 4px 8px;
    color: ${Colors.offwhite};
    font-family: 'oswald';
    text-align: center;
    float: right;
    align-self: flex-end;
    box-shadow: 2px 2px 3px #212121;
    margin-top: -4px;
`

const transition = {
    duration: 1,
    ease: easeInOutCubicBezier
}

const buttonVariants = {
    whileHover: {
        backgroundColor: Colors.primaryLight,
        transition: { ...transition, duration: 0.5 }
    },
    whileTap: {
        scale: 0.9,
        transition: transition
    }
}

export default function Button({ url, text, style, variants }) {
    // For isPhone context
    
    const handleButtonClick = (event) => {
        event.stopPropagation()
        window.open(url, "_blank")
    }
    return (
        <ButtonContainer whileHover="whileHover" variants={{ ...variants, ...buttonVariants }}
            style={{ ...style, fontSize: '14px' }}
            whileTap="whileTap" onClick={handleButtonClick} initial="onToOff" exit="onToOff"
            animate="offToOn" className="button-container">
            {text} 🡽
        </ButtonContainer>
    )
}