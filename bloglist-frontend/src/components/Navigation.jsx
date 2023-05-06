import { Link } from 'react-router-dom'
import { StyledNavigation } from './styles/Navigation.styled'

const Navigation = ({ user, handleLogout }) => {

  return (
    <StyledNavigation>
      <Link to="/">Blogs</Link>
      <Link to="/users">Users</Link>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout} className="logoutButton">
        logout
      </button>
    </StyledNavigation>
  )
}

export default Navigation