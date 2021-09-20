import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { primaryLight, primaryDark, primary, offwhite, black } from '../../../colors'
import { easeInOutCubicBezier } from "../../../utils"
import { useState, useCallback, useContext } from 'react'
import { showNotification } from '../../common/notification'
import IsPhoneContext from '../../../contexts/isPhoneContext'

const AddProductBoxContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    margin: 8px 12px 8px 12px;
    align-items: center;
    user-select: none;
    position: relative;
`

const SearchBoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 16px;
    overflow: hidden;
    border-radius: 4px;
`

const SearchBox = styled.input`
    font-family: 'raleway';
    width: 75%;
`

const SearchButton = styled(motion.div)`
    width: 25%;
    height: 100%;
    background-color: ${primary};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: ${offwhite};
    font-family: 'oswald';
    cursor: pointer;
`

const SearchTitle = styled.div`
    font-family: 'oswald';
    color: ${black};
    margin: 20px 16px 4px 16px;
    line-height: 100%;
`

const AddProductButton = styled(motion.div)`
    width: 220px;
    height: 42px;
    background-color: ${offwhite};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: ${black};
    font-family: 'oswald';
    cursor: pointer;
    font-size: 20px;
    border-radius: 4px;
    border: 2px solid ${primary};
    margin-top: 20px;
    box-shadow: 2px 2px 4px #9f9f9f;
`

const transition = {
    ease: easeInOutCubicBezier,
    duration: 0.8
}

const buttonVariantsExpanded = {
    whileHover: { backgroundColor: primaryDark, transition: transition },
    whileTap: { backgroundColor: primaryLight, transition: transition }
}

const buttonVariantsCollapsed = {
    whileHover: {
        backgroundColor: primaryDark,
        color: offwhite,
        width: "256px",
        transition: transition
    },
    whileTap: {
        backgroundColor: primaryLight,
        transition: transition
    }
}

const containerVariants = {
    animate: {
        opacity: 1,
        duration: 0.8,
        transition: transition
    },
    exit: {
        opacity: 0,
        duration: 0.8,
        transition: transition
    }
}


export default function AddProductBox({ invokeFetchProducts }) {
    // For isPhone context
    const isPhone = useContext(IsPhoneContext)

    //// Below code for initial button
    const [isOpen, setIsOpen] = useState(false)

    //// Below code for searchbox
    const [searchBarText, setSearchBarText] = useState(null)
    const [isPending, setIsPending] = useState(false)

    const handleSearch = useCallback(async (productUrl) => {
        setIsPending(true)
        let data = new FormData()
        data.append("productUrl", productUrl)
        try {
            let response = await fetch("/api/subscribeToProduct", {
                credentials: 'include',
                body: data,
                method: "POST"
            })
            if (response.ok) {
                showNotification("Added product to tracker!", "success")
                invokeFetchProducts()
            } else {
                showNotification("Could not add product to tracker!", "error")
            }
        } catch (err) { showNotification(err.toString(), "error") }

        setIsPending(false)
        setSearchBarText("")
        setIsOpen(false)
    }, [invokeFetchProducts])

    return (
        <AddProductBoxContainer layout>
            <AnimatePresence exitBeforeEnter>
                {!isOpen &&
                    <AddProductButton onClick={() => { setIsOpen(true) }} variants={{ ...buttonVariantsCollapsed, ...containerVariants }} whileHover="whileHover" whileTap="whileTap" animate="animate" exit='exit' key="collapsed-btn">
                        Add New
                    </AddProductButton>
                }
                {isOpen &&
                    <motion.div animate="animate" exit='exit' variants={containerVariants}
                        key="expanded" style={{
                            width: "100%",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                        <SearchTitle style={{ fontSize: (isPhone ? "42px" : "64px") }}>
                            Add Product
                        </SearchTitle>
                        <SearchBoxContainer id="add-product-box-container" style={{
                            height: (isPhone ? "36px" : "42px"),
                            width: (isPhone ? "80%" : "63%")
                        }}>
                            <SearchBox id="add-product-box-search-bar"
                                onChange={(e) => { setSearchBarText(e.target.value) }}
                                placeholder="Paste product url from Amazon" type='name' value={searchBarText}
                                style={{ fontSize: (isPhone ? "12px" : "14px"), }} />
                            <SearchButton id="add-product-box-search-button"
                                style={{
                                    opacity: (isPending ? 0.8 : 1),
                                    fontSize: (isPhone ? "16px" : "20px")
                                }} variants={buttonVariantsExpanded} whileHover="whileHover"
                                whileTap="whileTap" onClick={() => { handleSearch(searchBarText) }}>
                                {isPending ? "Searching..." : "Search"}
                            </SearchButton>
                        </SearchBoxContainer>
                    </motion.div>
                }
            </AnimatePresence>
        </AddProductBoxContainer>
    )
}