import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from './styles/Button.styled'
import { ButtonAlt } from './styles/ButtonAlt.styled'
import { StyledBlogView } from './styles/BlogView.styled'

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
    <StyledBlogView>
      <h2>{blog.title} by {blog.author}</h2>
      <a className='blogUrl' href={`//${blog.url}`}>{blog.url}</a>
      <p>{blog.likes} likes <Button onClick={() => addLike(blog.id)}>like</Button></p>
      <p>Added by <Link to={`/users/${user.id}`} className='username'>{blog.user.username}</Link></p>
      {blog.user.username === user.username && <ButtonAlt onClick={
        () => {
          deleteBlog(blog.id)
          navigate('/')
        }
      }>remove</ButtonAlt>}
      <div className='commentsContainer'>
        <h3>Comments</h3>
        {blog.comments.length>0 ?
          <ul>
            {blog.comments.map(comment =>
              (
                <li className='userComment' key={comment._id}>&quot;{comment.content}&quot;</li>
              )
            )}
          </ul>
          :
          (
            <p className='noComments'>No comments yet</p>
          )
        }
        <form onSubmit={newComment}>
          <input
            id="commentInput"
            type="text"
            value={comment}
            name="comment"
            placeholder='Type comment'
            onChange={({ target }) => setComment(target.value)}
          />
          <Button type="submit" className="submitButton">
            add comment
          </Button>
        </form>
      </div>
    </StyledBlogView>
  )
}

export default BlogView