import styled from 'styled-components'
import { motion } from 'framer-motion'
import CommonHeader from '../common/common-header'
import { useContext } from 'react'
import IsPhoneContext from '../../contexts/isPhoneContext'
import { offwhite, black, primary } from '../../colors'
import { easeInOutCubicBezier } from '../../utils'
import HomepagePic from '../../static/images/homepage_phone.png'
import DashboardPic from '../../static/images/dashboard_phone.png'
import EmailPic from '../../static/images/email_phone.png'
import { Link } from 'react-router-dom'
import Footer from '../common/footer'

const KnowMoreContainer = styled(motion.div)`
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

const Image = styled(motion.img)`
    float: ${({ float }) => (float)};
    width: 150px;
    margin: 16px;
`

const ALink = styled.a`
    text-decoration: none;
    color: ${primary};
    text-decoration: underline;
`

const knowMoreContainerVariant = {
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

const picVariant = {
    initial: {
        y: 150,
        opacity: 0
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1,
            ease: easeInOutCubicBezier,
        }
    },
    exit: {
        y: 50,
        opacity: 0,
        transition: {
            ease: easeInOutCubicBezier,
            duration: 1
        }
    }
}

export default function KnowMore() {
    const isPhone = useContext(IsPhoneContext)

    return (
        <KnowMoreContainer variants={knowMoreContainerVariant} initial="initial" animate='animate' exit='exit'>
            <CommonHeader needShadow pageTitle="Know more" />
            <Link style={{ textAlign: 'center', marginTop: '16px', fontFamily: 'raleway', color: primary }} to='/faq'>If you've questions, read the FAQ!</Link>
            <TextContainer id='what-is-brown-track'>
                <Title isPhone={isPhone} variants={textVariant}>What is Brown-Track?</Title>
                <Image float='right' src={HomepagePic} variants={picVariant} />
                <Text variants={textVariant}>
                    <p>
                        Brown-Track is a <b>free</b> price-tracker for Amazon. You use it to <b>get an idea what's the lowest the price of a product can fall to, then wait for that to happen to make the purchase.</b> <ALink href="#how-it-all-works">Brown-Track does things differently than other similar trackers out there.</ALink>
                    </p>
                    <p>
                        What's even better, is that you don't even have to keep visiting. <b>Brown-Track will let you know if the price today is the lowest, on your email.</b>
                    </p>
                </Text>
            </TextContainer>

            <TextContainer id='navigating-around'>
                <Title isPhone={isPhone} variants={textVariant}>Navigating around</Title>
                <Text variants={textVariant}>
                    <p>
                        To navigate around, use the menu on the top-right. It will take you all across the website.
                    </p>
                </Text>
            </TextContainer>

            <TextContainer id='the-dashboard'>
                <Title isPhone={isPhone} variants={textVariant}>The dashboard</Title>
                <Image float='left' src={DashboardPic} variants={picVariant} />
                <Text variants={textVariant}>
                    <p>
                        Once you signup and log in to your dashboard, you will see an empty space. That is because you haven't added any product to track yet. <b>All you need is the product's url on Amazon.</b> Copy the url from there, paste it here, and the product will be added.
                    </p>
                    <p>
                        Let the tracker keep taking a note of the prices everyday, and <b>it will let you know if the price observed on a day is the lowest</b> among all the days it has tracked the product.
                    </p>
                    <p>
                        You can also login and check your dashboard, and <b>manually see the price-graph to try and predict when the next price-drop may be!</b>Tap on each list item to view details.
                    </p>
                    <p>
                        <b>Once you're done, remove the product from the tracker</b>, and you'll stop receiving updates for the prices on your email.
                    </p>
                </Text>
            </TextContainer>

            <TextContainer id='email-notifications'>
                <Title isPhone={isPhone} variants={textVariant}>Email notifications</Title>
                <Image float='right' src={EmailPic} variants={picVariant} />
                <Text variants={textVariant}>
                    <p>
                        When Brown-Track starts tracking a product, it also notes who is tracking it, and adds them to a mailing list to email them if the product they are tracking has been observed to have the least price that day since the day it started tracking the product.
                    </p>
                    <p>
                        <b>Brown-Track does not send you useless newsletters or promotions in your email, only your products' price notifications (that is, if they are the lowest, as said above).</b>
                    </p>
                </Text>
            </TextContainer>

            <TextContainer id='how-it-all-works'>
                <Title isPhone={isPhone} variants={textVariant}>How it all works</Title>
                <Text variants={textVariant}>
                    <p>
                        <b>Brown-Track has a different approach than most other trackers out there.</b> It neither maintains a database of all past prices of all products, nor does it scrape prices of all products listed on Amazon everyday, because:
                        <ul>
                            <li>Past prices (noted since a few months/years ago) may not always tell you how low the price of the product may change at the present; lots of factors influence prices over time. So why bother?</li>
                            <li>Additionally, the huge database needed to maintain such a vast record would be impractical, because the data would be outdated, and outdated data would never help you make a purchase</li>
                            <li>Lastly, Amazon does not like automated scraping of their products' catalogue.</li>
                        </ul>
                    </p>
                    <p>
                        So how does Brown-Track do it? Well, <b>it lets you add a product to the tracker, and keeps noting the price of it everyday <i>(till you remove it)</i>. So when you wait for, say a week or two, and then visit the dashboard, you see the most recent prices and how they varied everyday.</b>
                    </p>
                    <p>
                        What's also special (for me, at least), is that Brown-Track is inspired from the publisher-subscriber model; <b>if multiple people are tracking the same product, they would all get the same data updates.</b> What this means for you, is that if someone else had added the same product to the tracker before you did, you would see the data collected since they started tracking it, so you need not wait to see the price trends!
                    </p>
                </Text>
            </TextContainer>
            <Footer />
        </KnowMoreContainer>
    )
}