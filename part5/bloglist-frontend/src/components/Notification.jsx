const Notification = ({ message, type }) => {
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

    if (message) {
        return (
            <div style={type === 'success' ? successNotificationStyle : errorNotificiationStyle} id='message'>{ message }</div>
        )
    } else {
        return null
    }
}

export default Notification