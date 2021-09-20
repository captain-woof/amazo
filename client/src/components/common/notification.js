import { toast } from 'react-toastify'

// Notification settings
const notificationSettings = {
    closeOnClick: true,
    draggablePercent: 40,
    theme: 'colored'
}

// type is among 'info', 'error', 'warn', 'success'
const showNotification = (message, type) => {
    switch (type) {
        case 'success':
            toast.success(message, notificationSettings)
            break
        case 'error':
            toast.error(message, notificationSettings)
            break
        case 'info':
            toast.info(message, notificationSettings)
            break
        case 'warn':
            toast.warn(message, notificationSettings)
            break
        default:
            toast.info(message, notificationSettings)
    }
}

const showPromiseNotification = (promise, { pendingMsg, successMsg, errorMsg }) => {
    toast.promise(promise, { error: errorMsg, pending: pendingMsg, success: successMsg }, notificationSettings)
}

export {showNotification, showPromiseNotification}

