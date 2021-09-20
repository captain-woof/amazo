import styled from 'styled-components'
import { motion } from 'framer-motion'
import ProductCard from "../card/index"
import { WaterfallGrid } from 'react-waterfall-grid'
import { useState, useEffect, useContext } from 'react'
import IsPhoneContext from '../../../contexts/isPhoneContext'

const SubscribedProductsContainer = styled(motion.div)`
    width: 100%;
    position: relative;
`

export default function SubscribedProducts({ subscribedProducts, invokeFetchProducts }) {
    const isPhone = useContext(IsPhoneContext)

    const [cardsToRender, setCardsToRender] = useState([])
    useEffect(() => {
        setCardsToRender(
            subscribedProducts.map((productCard) => (
                <ProductCard asin={productCard.asin}
                    description={productCard.description} prices={productCard.prices}
                    thumbnail={productCard.thumbnail} title={productCard.title}
                    url={productCard.url} key={productCard.productObjectId}
                    productObjectId={productCard.productObjectId}
                    invokeFetchProducts={invokeFetchProducts} />
            ))
        )
    }, [subscribedProducts, invokeFetchProducts])

    return (
        <SubscribedProductsContainer id="subscribed-products-container" layout layoutId='subscribed-products-container'>
            <WaterfallGrid styleGridContainer={{
                width: "100%",
                justifyContent: (isPhone ? "center" : "space-around")
            }} childWidth={320}
                childItems={cardsToRender} />
        </SubscribedProductsContainer>
    )
}