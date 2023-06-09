import { Link } from 'react-router-dom'
import { StyledNavigation } from './styles/Navigation.styled'
import { Container } from './styles/Container.styled'
import { Flex } from './styles/Flex.styled'
import { Button } from './styles/Button.styled'

const Navigation = ({ user, handleLogout }) => {

  return (
    <StyledNavigation>
      <Container>
        <nav>
          <Flex>
            <Link to="/">Blogs</Link>
            <Link to="/users">Users</Link>
          </Flex>
          <Flex>
            <p><span>{user.name}</span> logged in</p>
            <Button onClick={handleLogout} className="logoutButton">
              logout
            </Button>
          </Flex>
        </nav>
      </Container>
    </StyledNavigation>
  )
}

export default Navigation