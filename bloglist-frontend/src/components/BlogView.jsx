import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BlogView = ({ individualBlog, addLike, deleteBlog }) => {
  const blog = individualBlog
  const user = useSelector(({ user }) => user)
  const navigate = useNavigate()


  if (!blog) {
    return null
  }

  return (
    <>
      <h2>{blog.title} by {blog.author}</h2>
      <a href={`//${blog.url}`}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={() => addLike(blog.id)}>like</button></p>
      <p>Added by {blog.user.username}</p>
      {blog.user.username === user.username && <button onClick={
        () => {
          deleteBlog(blog.id)
          navigate('/')
        }
      }>remove</button>}
      <h3>Comments</h3>
      <ul>
        {blog.comments.map(comment =>
          (
            <li key={comment._id}>{comment.content}</li>
          )
        )}
      </ul>
    </>
  )
}

export default BlogView