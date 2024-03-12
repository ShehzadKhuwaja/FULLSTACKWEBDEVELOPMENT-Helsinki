import { useMessageValue } from "../notificationContext"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const message = useMessageValue()
  console.log(message)
  if (!message) return null

  return (
    <div style={style}>
      { message }
    </div>
  )
}

export default Notification
