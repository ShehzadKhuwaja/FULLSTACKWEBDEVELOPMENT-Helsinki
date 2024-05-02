import { useSelector } from "react-redux"

const Notification = () => {
    const notification = useSelector(state => state.message)

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

    if (notification.message) {
        return (
            <div style={notification.type === 'success' ? successNotificationStyle : errorNotificiationStyle} id='message'>{ notification.message }</div>
        )
    } else {
        return null
    }
}

export default Notification