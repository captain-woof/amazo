import { useMergeState } from 'use-merge-state'
import { useCallback } from 'react'
import { useMediaQuery } from 'react-responsive'
import { showNotification } from './notification'
import UserContext from '../../contexts/userContext'
import IsPhoneContext from '../../contexts/isPhoneContext'
import App from '../../App';
import { ToastContainer } from 'react-toastify'
import '../../static/css/toasts.css'

export default function AllContextsWrappingApp() {
    //// For UserContext
    // This state contains user informmation and the logged in state
    const [userContextState, setUserContextState] = useMergeState({
        name: "Visitor",
        email: null,
        isLoggedIn: false,
        currency: null
    })

    // Fetch and set this information
    const fetchAndSetUserContextState = useCallback(async () => {
        try {
            let response = await fetch("/api/getUserDetails", {
                credentials: 'include',
                method: "GET"
            })
            let responseJson = await response.json()
            setUserContextState({
                name: responseJson.name,
                email: responseJson.email,
                currency: responseJson.currency,
                isLoggedIn: responseJson.isLoggedIn
            })
            return {displayName: responseJson.name}
        } catch (err) {
            showNotification(err, 'error')
        }
    }, [setUserContextState])

    //// For IsPhoneContext
    // State to track if device is a phone
    const isPhone = useMediaQuery({ query: "(max-width: 600px)" })

    // All Context Providers are nested, and ultimately nest <App>
    return (
        <UserContext.Provider value={{ userContextState, setUserContextState, fetchAndSetUserContextState }}>
            <IsPhoneContext.Provider value={isPhone}>
                <ToastContainer />
                <App />
            </IsPhoneContext.Provider>
        </UserContext.Provider>
    )
}