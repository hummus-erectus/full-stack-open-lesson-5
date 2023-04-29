import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => notification)

  return notification.message && (
    <div className={`feedback ${notification.type}`}>
      {notification.message}
    </div>
  )
}

export default Notification