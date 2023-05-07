import Blog from './Blog'
import { StyledBlogsList } from './styles/BlogsList.styled'

const BlogsList = ({ blogs }) => {
  return (
    <StyledBlogsList>
      <h2>Blog list</h2>
      <ul>
        {blogs
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
            />
          ))}
      </ul>
    </StyledBlogsList>
  )
}

export default BlogsList

