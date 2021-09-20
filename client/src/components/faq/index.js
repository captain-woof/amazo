import styled from 'styled-components'
import { motion } from 'framer-motion'
import CommonHeader from '../common/common-header'
import { useContext } from 'react'
import IsPhoneContext from '../../contexts/isPhoneContext'
import { offwhite, black, primary } from '../../colors'
import { easeInOutCubicBezier } from '../../utils'
import { Link } from 'react-router-dom'
import Footer from '../common/footer'

const FAQContainer = styled(motion.div)`
    width: 100vw;
    background-color: ${offwhite};
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
`

const TextContainer = styled.div`
    color: ${black};
    margin: 16px;
`

const Title = styled(motion.div)`
    font-family: 'oswald';
    font-size: ${({ isPhone }) => (isPhone ? "42px" : "64px")};
`

const Text = styled(motion.div)`
    font-family: 'raleway';
    font-size: 16px;
    margin: 0px 16px;
    text-align: justify;
`

const ALink = styled.a`
    text-decoration: none;
    color: ${primary};
    text-decoration: underline;
    font-weight: 'bold';
`

const faqContainerVariant = {
    initial: {
        x: "100vw",
    },
    animate: {
        x: "0vw",
        transition: {
            when: "beforeChildren",
            duration: 1,
            ease: easeInOutCubicBezier,
            staggerChildren: 0.2
        }
    },
    exit: {
        x: "-100vw",
        transition: {
            ease: easeInOutCubicBezier,
            duration: 1
        }
    }
}

const textVariant = {
    initial: {
        x: 150,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 1,
            ease: easeInOutCubicBezier,
        }
    },
    exit: {
        x: -50,
        opacity: 0,
        transition: {
            ease: easeInOutCubicBezier,
            duration: 1
        }
    }
}

export default function FAQ() {
    const isPhone = useContext(IsPhoneContext)

    return (
        <FAQContainer variants={faqContainerVariant} initial="initial" animate='animate' exit='exit'>
            <CommonHeader needShadow pageTitle="FAQ" />
            <Link style={{ textAlign: 'center', marginTop: '16px', fontFamily: 'raleway', color: primary }} to='/know_more'>To know more, click here!</Link>
            <TextContainer id='how-does-it-all-work'>
                <Title isPhone={isPhone} variants={textVariant}>How does it all work?</Title>
                <Text variants={textVariant}>
                    <p>
                        You might wanna read this one in detail <Link style={{ textAlign: 'center', marginTop: '16px', fontFamily: 'raleway', color: primary }} to='/know_more'>here</Link>. <i>(scroll down to way bottom there)</i>
                    </p>
                </Text>
            </TextContainer>
            <TextContainer id='do-i-need-to-provide-my-credit-debit-card-information'>
                <Title isPhone={isPhone} variants={textVariant}>Do I need to provide my credit/debit card information?</Title>
                <Text variants={textVariant}>
                    <p>
                        <b>Absolutely not!</b> Brown-Track is free to use, forever!
                    </p>
                </Text>
            </TextContainer>
            <TextContainer id='what-data-gets-stored'>
                <Title isPhone={isPhone} variants={textVariant}>What data gets stored?</Title>
                <Text variants={textVariant}>
                    <p>
                        Only the information asked from you during registration (name, email, etc) and the product details that the tracker tracks. There's nothing else to store.
                    </p>
                </Text>
            </TextContainer>
            <TextContainer id='do-you-share-sensitive-data-with-anyone'>
                <Title isPhone={isPhone} variants={textVariant}>Do you share sensitive data with anyone?</Title>
                <Text variants={textVariant}>
                    <p>
                        Not now, not ever! The only data that I 'share' is with Google, strictly for SEO and gathering anonymous analytical data, for demographics.
                    </p>
                </Text>
            </TextContainer>
            <TextContainer id='isnt-it-illegal-to-scrape-amazon'>
                <Title isPhone={isPhone} variants={textVariant}>Isn't it illegal to scrape Amazon?</Title>
                <Text variants={textVariant}>
                    <p>
                        It probably is, however, <b>Brown-Track does not 'scrape' Amazon.</b>, because it does not need to. It does not need to maintain a database of all products listed on Amazon. It only automates what you (or any customer, for that matter) would have done anyways.
                    </p>
                    <p>
                        So how does it work? <Link style={{ fontFamily: 'raleway', color: primary }} to='/know_more'>Read this.</Link> <i>(scroll way down on that page)</i>
                    </p>
                </Text>
            </TextContainer>
            <TextContainer id='who-are-you'>
                <Title isPhone={isPhone} variants={textVariant}>Who are you?</Title>
                <Text variants={textVariant}>
                    <p>
                        I am Sohail, and I am the creator of Brown-Track. I made Brown-Track because, well, I needed a product price tracker for Amazon, but couldn't find a good one.
                    </p>
                    <p>
                        To visit my portfolio, head over to <ALink href="https://sohail-saha.in">sohail-saha.in</ALink>.
                    </p>
                </Text>
            </TextContainer>
            <TextContainer id='how-is-brown-track-free'>
                <Title isPhone={isPhone} variants={textVariant}>How is Brown-Track free?</Title>
                <Text variants={textVariant}>
                    <p>
                        All of the platforms Brown-Track is built on, offer a free-tier, and those are what I use. It does not offer unlimited services though, and if Brown-Track starts getting a huge number of users, I may have to shift to paid tiers.
                    </p>
                    <p>
                        That being said, Brown-Track will always remain free. However, I'd be grateful if you choose to <Link style={{ fontFamily: 'raleway', color: primary }} to='/donate'>donate anything that you can spare</Link>.
                    </p>
                </Text>
            </TextContainer>
            <Footer />
        </FAQContainer>
    )
}