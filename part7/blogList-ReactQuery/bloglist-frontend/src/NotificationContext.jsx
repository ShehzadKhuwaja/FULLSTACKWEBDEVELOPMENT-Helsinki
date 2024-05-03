import { createContext, useReducer, useContext } from "react"

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'notify':
            return action.payload
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [message, messageDispatch] = useReducer(notificationReducer, {message: null, type: null})
    return (
        <NotificationContext.Provider value={[message, messageDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useMessageValue = () => {
    const notifyAndDispatch = useContext(NotificationContext)
    return notifyAndDispatch[0]
}

export const useMessageDispatch = () => {
    const notifyAndDispatch = useContext(NotificationContext)
    return notifyAndDispatch[1]
}

export const setnotification = (message, type) => {
    return { type: 'notify', payload: { message, type } }
}

export const unsetNotification = () => {
    return { type: 'notify', payload: { message: null, type: null } }
}

export default NotificationContext

