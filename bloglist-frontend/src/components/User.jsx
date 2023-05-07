import { useSelector } from 'react-redux'
import { StyledBlogsList } from './styles/BlogsList.styled'
import { Link } from 'react-router-dom'

const User = ({ individualUser }) => {
  const blogs = useSelector(({ blog }) => blog)
  const user = individualUser

  if (!user) {
    return null
  }

  return (
    <StyledBlogsList>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {blogs
          .filter((blog) => blog.user.id === user.id)
          .map((blog) => (
            <li className='blog' key={blog.id}>
              <Link to={`/blogs/${blog.id}`}><span className="blogTitle">{blog.title}</span> by <span className="blogAuthor">{blog.author}</span></Link>
            </li>
          ))
        }
      </ul>
    </StyledBlogsList>
  )
}

export default User