import styled from 'styled-components'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useContext } from 'react'
import ProductImage from './image'
import Colors from "../../../colors"
import { easeInOutCubicBezier } from "../../../utils"
import Button from "./button"
import ProductPriceGraph from "./graph"
import DeleteButton from './delete'
import IsPhoneContext from '../../../contexts/isPhoneContext'

const ProductCardContainer = styled(motion.div)`
   height: 80px;
   cursor: pointer;
   border-radius: 4px;
   background-color: ${Colors.offwhite};
   box-shadow: 1px 1px 4px #aaaaaa;
   overflow: hidden;
   margin: 4px;
   position: relative;
`
const transition = {
    duration: 1,
    ease: easeInOutCubicBezier
}

const CardContentContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    position: relative;
    margin-right: 12px;
    z-index: 2;
    color: ${Colors.black};
`

const getMinPrice = (prices) => {
    var minPrice = Infinity
    prices.forEach((priceEle) => {
        // eslint-disable-next-line
        if ((priceEle.price < minPrice) && (priceEle.price != 0)) {
            minPrice = priceEle.price
        }
    })
    return minPrice
}

const disappearingEleTransitionHor = {
    offToOn: {
        opacity: 1,
        x: 0,
        transition: transition
    },
    onToOff: {
        x: 50,
        opacity: 0,
        transition: transition
    }
}

const disappearingEleTransitionVer = {
    offToOn: {
        opacity: 1,
        y: 0,
        transition: transition
    },
    onToOff: {
        y: 50,
        opacity: 0,
        transition: transition
    }
}

const productCardContainerVariants = {
    offToOn: {
        height: "360px",
        transition: transition
    },
    onToOff: {
        height: "80px",
        transition: transition
    },
    whileHover: {
        backgroundColor: Colors.primaryLight,
        transition: transition
    },
    whileTap: {
        scale: 0.9,
        transition: { ...transition, duration: 0.2 }
    }
}

const cardContentContainerVariant = {
    offToOn: {
        marginLeft: "12px",
        color: Colors.offwhite,
        transition: transition
    },
    onToOff: {
        marginLeft: "80px",
        color: Colors.black,
        transition: transition
    }
}

// 'prices' just is an array of {date, price}
export default function ProductCard({ asin, title, description, thumbnail, url, prices, productObjectId, invokeFetchProducts }) {
    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    const [isCardOpen, changeIsCardOpen] = useState(false)

    const cardAnimation = useAnimation()
    useEffect(() => {
        if (isCardOpen) {
            cardAnimation.start("offToOn")
        } else {
            cardAnimation.start("onToOff")
        }
    }, [isCardOpen, cardAnimation])

    const changeCardOpenState = () => {
        changeIsCardOpen(!isCardOpen)
    }

    // Price calc
    var min_price = getMinPrice(prices)
    var latest_price = prices[prices.length - 1].price

    var percentage_price = null
    // eslint-disable-next-line
    if ((min_price === Infinity) || (latest_price == 0)) {
        percentage_price = "N/A" // If product is unavl, show N/A
    } else {
        percentage_price = ((latest_price - min_price) / min_price * 100)
        percentage_price = percentage_price.toPrecision(percentage_price < 10 ? 2 : 3)
    }

    // eslint-disable-next-line
    min_price = (min_price == Infinity ? "N/A" : min_price) // If min price is Infinity, display N/A
    // eslint-disable-next-line
    latest_price = (latest_price == 0 ? "N/A" : latest_price) // If product is currently unavl, show N/A

    return (
        <AnimatePresence exitBeforeEnter>
            <ProductCardContainer className="product-card-container" onClick={changeCardOpenState}
                whileHover="whileHover" variants={productCardContainerVariants} animate={cardAnimation}
                whileTap="whileTap" layout key="product-card-container" style={{
                    width: (isPhone ? "292px" : "320px")
                }}>
                <ProductImage isCardOpen={isCardOpen} thumbnail={thumbnail} isPhone={isPhone} />
                <DeleteButton isCardOpen={isCardOpen} productObjectId={productObjectId}
                    invokeFetchProducts={invokeFetchProducts} isPhone={isPhone} />
                <CardContentContainer className="card-content-container" layout
                    variants={cardContentContainerVariant} animate={cardAnimation}
                    key="card-content-container" style={{
                        marginLeft: (isPhone ? "80px" : "80px")
                    }}>
                    <motion.div key="product-title" style={{
                        fontFamily: 'oswald',
                        fontSize: (isPhone ? "20px" : "24px"),
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }} className="product-title" layout>{title}</motion.div>
                    {isCardOpen ?
                        <motion.div animate={cardAnimation} style={{
                            fontFamily: 'oswald',
                            fontSize: (isPhone ? "14px" : "16px")
                        }} className="prdduct-asin" variants={disappearingEleTransitionHor}
                            key="product-asin" layout exit="onToOff" initial="onToOff">
                            ASIN: {asin}
                        </motion.div>
                        : null}
                    {isCardOpen ?
                        <motion.div className="product-description" style={{
                            fontFamily: 'oswald',
                            fontSize: "12px"
                        }}>
                            <b>Description: </b>{description}
                        </motion.div>
                        : null}
                    {isCardOpen ?
                        <ProductPriceGraph layout prices={prices} key="product-price-graph"
                            className="product-price-graph" variants={disappearingEleTransitionVer}
                            animate={cardAnimation} isPhone={isPhone} />
                        : null}
                    <motion.div style={{
                        fontFamily: 'oswald',
                        fontSize: (isPhone ? "12px" : "14px"),
                        display: "flex",
                        flexDirection: "row"
                    }} layout key="product-prices" className="product-prices">
                        <div>Min: {min_price} &nbsp;</div>
                        <div>Latest: {latest_price}</div>
                    </motion.div>
                    <motion.div style={{
                        fontFamily: 'oswald',
                        fontSize: (isPhone ? "12px" : "14px"),
                        // eslint-disable-next-line
                        color: (percentage_price == 0 ? Colors.green : Colors.red)
                    }}>
                        {/* eslint-disable-next-line*/}
                        ({percentage_price} {percentage_price == "N/A" ? "" : "%"}) {
                            // eslint-disable-next-line
                            percentage_price != "N/A"
                                // eslint-disable-next-line
                                ? (percentage_price == 0 ? "▶" : "▲")
                                : ""
                        }
                    </motion.div>

                    {isCardOpen ?
                        <Button text="View on Amazon" url={url} layout
                            key="visit-button" className="visit-button"
                            variants={disappearingEleTransitionVer} />
                        : null}
                </CardContentContainer>
            </ProductCardContainer>
        </AnimatePresence>
    )
}