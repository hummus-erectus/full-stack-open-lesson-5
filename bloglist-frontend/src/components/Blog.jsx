import { useState } from 'react'

const Blog = ({
  blog,
  addLike,
  deleteBlog,
  user
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="titleAndAuthor">
        {blog.title} {blog.author}
        <button
          className="toggleButton"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? 'hide' : 'show'}
        </button>
      </div>
      {isOpen ? (
        <>
          <p className="url">{blog.url}</p>
          <p className="likes">
            {blog.likes}{' '}
            <button onClick={addLike} className="likeButton">
              likes
            </button>
          </p>
          <p className="name">{blog.user.name}</p>
          {blog.user.username === user.username && (
            <button className="removeButton" onClick={deleteBlog}>
              remove
            </button>
          )}
        </>
      ) : null}
    </div>
  )
}

export default Blog
