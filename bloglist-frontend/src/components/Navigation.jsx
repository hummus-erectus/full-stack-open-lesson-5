import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {

  return (
    <nav>
      <Link to="/">Blogs</Link>
      <Link to="/users">Users</Link>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout} className="logoutButton">
        logout
      </button>
    </nav>
  )
}

export default Navigation