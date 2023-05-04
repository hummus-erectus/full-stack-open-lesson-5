import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const BlogView = ({ individualBlog, addLike, deleteBlog, addComment }) => {
  const blog = individualBlog
  const user = useSelector(({ user }) => user)
  const navigate = useNavigate()

  const [comment, setComment] = useState('')

  const newComment = async (event) => {
    event.preventDefault()
    addComment(blog.id, comment)
    setComment('')
  }


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
      <form onSubmit={newComment}>
        <input
          id="commentInput"
          type="text"
          value={comment}
          name="comment"
          placeholder='Type comment'
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit" className="submitButton">
          Add Comment
        </button>
      </form>
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