import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [isOpen, setIsOpen] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setIsOpen(prev => !prev)}>{isOpen? 'hide' : 'show'}</button>
      </div>
      {isOpen?
        <>
          <p>{blog.url}</p>
          <p>{blog.likes} <button onClick={addLike}>likes</button></p>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username && <button onClick={deleteBlog}>remove</button>}
        </>
        :
        null
      }

    </div>
  )
}

export default Blog