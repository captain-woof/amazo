import styled from 'styled-components'
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion"
import CommonHeader from "../common/common-header"
import Loading from "./loading"
import { useState, useEffect, useContext, useCallback } from "react"
import { useHistory } from 'react-router-dom'
import SubscribedProducts from "./subscribed-products"
import { easeInOutCubicBezier } from "../../utils"
import colors from '../../colors'
import AddProductBox from './addProduct/index'
import IsPhoneContext from '../../contexts/isPhoneContext'
import Footer from '../common/footer'

const DashboardContainer = styled(motion.div)`
    width: 100vw;
`

const dashboardContainerVariant = {
    initial: {
        x: "100vw",
    },
    animate: {
        x: "0vw",
        transition: {
            when: "beforeChildren",
            duration: 1,
            ease: easeInOutCubicBezier,
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

const Title = styled(motion.div)`
    font-family: 'oswald';
    color: ${colors.black};
    margin: 8px 28px 8px 28px;
    user-select: none;
    position: relative;
`

const NoProductFound = styled(motion.div)`
    font-family: 'raleway';
    font-size: 18px;
    color: ${colors.grey};
    display: flex;
    height: 280px;
    justify-content: center;
    align-items: center;
    position: relative;
`

export default function Dashboard() {

    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    // History from react router
    const history = useHistory()

    // Keeping track of loading
    const [hasContentLoaded, changeHasContentLoaded] = useState(false)
    const [contentLoadedStatus, changeContentLoadedStatus] = useState("Loading...")

    // Render a loading screen first, then download results, then render them
    const [subscribedProducts, changeSubscribedProducts] = useState([])

    // Function to fetch contents
    const invokeFetchProducts = useCallback(() => {
        fetch("/api/getAllSubscribedProducts", {
            credentials: 'include',
            method: 'GET'
        }).then((response) => {
            response.json().then((responseJson) => {
                if (!response.ok) {
                    changeContentLoadedStatus(responseJson.message)
                    history.push("/")
                } else {
                    changeSubscribedProducts(responseJson)
                    changeHasContentLoaded(true)
                }
            })
        })
    }, [history])

    useEffect(() => {
        invokeFetchProducts()
    }, [invokeFetchProducts])

    return (
        <DashboardContainer id="dashboard-container" variants={dashboardContainerVariant}
            animate="animate" exit="exit" initial="initial">
            <AnimateSharedLayout type='crossfade'>
                <CommonHeader pageTitle="Dashboard" needShadow />
                <AddProductBox invokeFetchProducts={invokeFetchProducts} />
                <Title style={{ fontSize: (isPhone ? "42px" : "64px"), textAlign: (isPhone ? "center" : null) }}
                    layout>
                    Your products
                </Title>
                <AnimatePresence>
                    {!hasContentLoaded ?
                        <Loading statusText={contentLoadedStatus} /> :
                        (subscribedProducts.length !== 0
                            ? <SubscribedProducts subscribedProducts={subscribedProducts}
                                invokeFetchProducts={invokeFetchProducts} />
                            : <NoProductFound layout>No products tracked!</NoProductFound>)
                    }
                </AnimatePresence>
            </AnimateSharedLayout>
            <Footer />
        </DashboardContainer>
    )
}