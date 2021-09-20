import styled from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import { easeInOutCubicBezier } from "../../../utils"
import { useEffect, useMemo, useContext } from 'react'
import Colors from "../../../colors"
import IsPhoneContext from '../../../contexts/isPhoneContext'

const ProductImageContainer = styled(motion.div)`
    overflow: hidden;
    height: 64px;
    width: 64px;
    border-radius: 50%;
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 8px;
    left: 8px;
`

const transition = {
    duration: 1,
    ease: easeInOutCubicBezier
}

const Image = styled(motion.img)`
    height: 100%;
    width: 100%;
    position: relative;
`

const Overlay = styled(motion.div)`
    height: 100%;
    width: 100%;
    position: relative;
    margin-left: -100%;
    background-color: ${Colors.grey};
    opacity: 0;
`

const overlayVariant = {
    offToOn: {
        opacity: 0.7,
        transition: transition
    },
    onToOff: {
        opacity: 0,
        transition: transition
    }
}

const productImageVariants = {
    offToOn: {
        opacity: 0.8,
        transition: transition
    },
    onToOff: {
        opacity: 1,
        transition: transition
    }
}

export default function ProductImage({ thumbnail, isCardOpen }) {
    const animation = useAnimation()

    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    // Stuff that depends on 'isPhone'
    const productImageContainerVariants = useMemo(() => (
        {
            offToOn: {
                height: "360px",
                width: (isPhone ? "292px" : "320px"),
                borderRadius: "0%",
                top: "0px",
                left: "0px",
                transition: transition
            },
            onToOff: {
                height: "64px",
                width: "64px",
                borderRadius: "50%",
                top: "8px",
                left: "8px",
                transition: transition
            }
        }
    ), [isPhone])

    // To trigger animation
    useEffect(() => {
        if (isCardOpen) {
            animation.start("offToOn")
        } else {
            animation.start("onToOff")
        }
    }, [isCardOpen, animation])

    return (
        <ProductImageContainer variants={productImageContainerVariants} animate={animation}
            className="product-image-container">
            <Image src={thumbnail} className="product-image" variants={productImageVariants}
                animate={animation} />
            <Overlay className="product-image-overlay" variants={overlayVariant} animate={animation} />
        </ProductImageContainer>
    )
}