import styled from 'styled-components'
import { motion } from 'framer-motion'
import Colors from "../../../colors"
import { easeInOutCubicBezier } from "../../../utils"

const ButtonContainer = styled(motion.div)`
    width: 64px;
    padding: 8px;
    color: ${Colors.offwhite};
    font-size: 16px;
    border-radius: 4px;
    font-family: 'raleway';
    cursor: pointer;
    text-align: center;
    background-color: ${Colors.greenPrimary};
`

const buttonVariant = {
    whileHover: {
        backgroundColor: Colors.greenDarkPrimary,
        transition: {
            duration: 0.5,
            ease: easeInOutCubicBezier
        }
    }
}

export default function Button({ buttonText, onClickHandler, id, style }) {
    return (
        <ButtonContainer id={id} onClick={onClickHandler} variants={buttonVariant}
            initial="initial" whileHover="whileHover" style={style}>{buttonText}</ButtonContainer>
    )
}