import styled from 'styled-components'
import { motion } from 'framer-motion'
import { offwhite, black } from '../../colors'
import { useContext } from 'react'
import IsPhoneContext from '../../contexts/isPhoneContext'
import MyImage from '../../static/images/my_image.jpg'
import { easeInCubicBezier, easeInOutCubicBezier } from '../../utils'

const DonateContainer = styled(motion.div)`
    position: absolute;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: ${({ isPhone }) => (isPhone ? "column" : 'row')};
    background-color: ${offwhite};
    top: 0px;
    left: 0px;
`

const MyImageContainer = styled.img`
    position: relative;
    width: ${({ isPhone }) => (isPhone ? '100vw' : '40%')};
    height: ${({ isPhone }) => (isPhone ? "20%" : "100vh")};
    object-fit: cover;
    object-position: ${({ isPhone }) => (isPhone ? "0px -10px" : "-135px 0px")};
`

const ContentContainer = styled.div`
    position: relative;
    width: ${({ isPhone }) => (isPhone ? '100vw' : '60%')};
    height: ${({ isPhone }) => (isPhone ? "80%" : "100vh")};
    display: flex;
    flex-direction: column;
`

const DonateTitle = styled.div`
    width: 100%;
    font-family: 'oswald';
    font-size: ${({ isPhone }) => (isPhone ? "56px" : "64px")};
    color: ${black};
    margin: 16px;
`

const DonateText = styled.div`
    width: 100%;
    font-family: 'raleway';
    font-size: ${({ isPhone }) => (isPhone ? "14px" : "16px")};
    color: ${black};
    text-align: justify;
    width: 80%;
    align-self: center;
`

const BuyMeCoffeeContainer = styled.a`
    width: max-content;
    align-self: center;
    margin-top: 48px;
`

const buyMeCoffeeImageVariant = {
    whileHover: {
        scale: [1, 1.1, 1],
        transition: {
            repeat: Infinity,
            duration: 1.2,
            ease: easeInOutCubicBezier
        }
    }
}

const donateContainerVariant = {
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

export default function Donate() {
    const isPhone = useContext(IsPhoneContext)

    return (
        <DonateContainer isPhone={isPhone} variants={donateContainerVariant} initial='initial'
            animate='animate' exit='exit'>
            <MyImageContainer isPhone={isPhone} src={MyImage} alt='sohail-image' />
            <ContentContainer isPhone={isPhone}>
                <DonateTitle isPhone={isPhone}>Donate</DonateTitle>
                <DonateText isPhone={isPhone}>
                    Brown-Track is free to use now, and it will be free in the future too. However, keeping the site up and running requires resources. I'd be grateful if you could donate anything that you can spare.
                </DonateText>
                <BuyMeCoffeeContainer href="https://www.buymeacoffee.com/captainwoof"
                    target="_blank">
                    <motion.img alt="buy-me-a-coffee" src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=captainwoof&button_colour=FF5F5F&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" variants={buyMeCoffeeImageVariant} whileHover="whileHover"/>
                </BuyMeCoffeeContainer>
            </ContentContainer>
        </DonateContainer>
    )
}