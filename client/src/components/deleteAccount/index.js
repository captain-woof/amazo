import { easeInCubicBezier } from "../../utils"
import { motion } from "framer-motion"
import styled from 'styled-components'
import CommonHeader from '../common/common-header'
import PasswordField from "./passwordField"
import { useState } from "react"
import { grey } from '../../colors'
import Button from "./button"
import Footer from '../common/footer'

const DeleteAccountContainer = styled(motion.div)`
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
`

const SubtitleText = styled.div`
    font-family: 'raleway';
    color: ${grey};
    font-size: 12px;
    display: flex;
    justify-content: center;
`

const loginSignupContainerVariant = {
    initial: {
        x: "100vw",
    },
    animate: {
        x: "0vw",
        transition: {
            ease: easeInCubicBezier,
            duration: 1,
            delayChildren: 0.4,
            staggerChildren: 0.5,
            when: "beforeChildren"
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

export default function DeleteAccount() {
    const [password, setPassword] = useState("")

    return (
        <DeleteAccountContainer variants={loginSignupContainerVariant} initial="initial" exit="exit" animate='animate'>
            <CommonHeader needShadow pageTitle="Delete account" />
            <PasswordField fieldValue={password} setFieldValue={setPassword} />
            <SubtitleText>This action is irreversible!</SubtitleText>
            <Button password={password} />
            <Footer />
        </DeleteAccountContainer>
    )
}