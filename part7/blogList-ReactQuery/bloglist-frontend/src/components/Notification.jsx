import { useMessageValue } from "../NotificationContext"

const Notification = () => {
    const message = useMessageValue()

    const successNotificationStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    const errorNotificiationStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    
    if (message.message) {
        return (
            <div style={message.type === 'success' ? successNotificationStyle : errorNotificiationStyle} id='message'>{ message.message }</div>
        )
    } else {
        return null
    }
}

export default Notification