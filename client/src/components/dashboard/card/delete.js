import { motion } from 'framer-motion'
import styled from 'styled-components'
import { red, primaryLight } from '../../../colors'
import DeleteIcon from '../../../static/logos/delete_logo.svg'
import { easeOutCubicBezier } from "../../../utils"
import { showPromiseNotification } from '../../common/notification'
import { useCallback } from 'react'
import { useContext } from 'react/cjs/react.development'
import IsPhoneContext from '../../../contexts/isPhoneContext'

const DeleteButtonContainer = styled(motion.div)`
    height: 24px;
    width: 24px;
    background-color: ${red};
    position: absolute;
    border-radius: 50%;
    overflow: hidden;
    padding: 2px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 10;
    right: 8px;
    bottom: ${({isPhone, isCardOpen}) => (isCardOpen ? (isPhone ? "56px" : "42px") : "8px")};
`

const DeleteIconImg = styled.img`
    height: 16px;
    width: 16px;
`

export default function DeleteButton({ isCardOpen, productObjectId, invokeFetchProducts }) {
    const isPhone = useContext(IsPhoneContext)

    const handleDelete = useCallback((event) => {
        event.stopPropagation()

        let deleteProductForm = new FormData()
        deleteProductForm.append('productObjectIdString', productObjectId)
        let unsubscribePromise = fetch("/api/unsubscribeToProduct", {
            credentials: 'include',
            method: 'POST',
            body: deleteProductForm
        })
        showPromiseNotification(unsubscribePromise, {
            pendingMsg: "Untracking the product",
            successMsg: "Product untracked!",
            errorMsg: "Product could not be untracked!"
        })

        unsubscribePromise.then((resp) => {
            if (resp.ok) {
                invokeFetchProducts()
            }
        })
    },[invokeFetchProducts, productObjectId])

    return (
        <DeleteButtonContainer onClick={handleDelete} whileTap={{ scale: 0.9 }} whileHover={{
            backgroundColor: primaryLight,
            transition: { ease: easeOutCubicBezier, duration: 1 }
        }} className="delete-button-container" isPhone={isPhone} isCardOpen={isCardOpen}>
            <DeleteIconImg src={DeleteIcon} alt="Delete" className="delete-button-icon" />
        </DeleteButtonContainer>
    )
}