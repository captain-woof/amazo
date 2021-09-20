import Colors from "../../colors"
import styled from 'styled-components'
import { motion } from "framer-motion"
import { easeInOutCubicBezier } from "../../utils"
import IsPhoneContext from '../../contexts/isPhoneContext'
import { useContext, useMemo } from "react"
import LogoSvg from '../../static/images/logo.svg'

const CommonHeaderContainer = styled.div`
    width: 100vw;
    background-color: ${Colors.primaryDark};
    color: ${Colors.offwhite};
    display: flex;
    flex-direction: column;
    box-shadow: ${({ needShadow }) => (needShadow ? `0px 3px 3px ${Colors.blackLight}` : null)};
    user-select: none;
    position: relative;
    height: ${({ isPhone }) => (isPhone ? "140px" : "180px")};
`

const LogoAndBrownTrackHeadingContainer = styled(motion.div)`
    display: flex;
    flex-direction: row;
    margin: 12px;
`

const Logo = styled.img`
    width: 36px;
`

const BrownTrackHeading = styled.div`
    font-family: 'oswald';
    font-size: 30px;
    margin-left: 8px;
`

const PageTitleHeading = styled(motion.div)`
    font-family: 'raleway';
    height: 100%;
    display: flex;
    flex-direction: row;
    margin-left: 16px;
    font-weight: bold;
    justify-content: center;
`

export default function CommonHeader({ pageTitle, needShadow = false }) {
    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    const headerVariants = useMemo(() => ({
        initial: {
            x: (isPhone ? 72 : 120),
            opacity: 0
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                ease: easeInOutCubicBezier,
                duration: 1
            }
        }
    }), [isPhone])

    return (
        <CommonHeaderContainer needShadow={needShadow} isPhone={isPhone}>
            <LogoAndBrownTrackHeadingContainer variants={headerVariants} animate="animate"
                initial="initial">
                <Logo id="header-brown-track-logo" src={LogoSvg} />
                {!isPhone &&
                    <BrownTrackHeading id="header-brown-track-text" >Brown-Track</BrownTrackHeading>
                }
            </LogoAndBrownTrackHeadingContainer>

            <PageTitleHeading id="header-page-title" style={{
                fontSize: (isPhone ? "48px" : "88px")
            }} variants={headerVariants} animate="animate" initial="initial">
                <span style={{ alignSelf: 'flex-end' }}>{pageTitle}</span>
            </PageTitleHeading>
        </CommonHeaderContainer>
    )
}