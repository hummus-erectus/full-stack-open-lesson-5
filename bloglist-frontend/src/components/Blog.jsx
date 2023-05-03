const Blog = ({ blog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className="blog">
      <a href={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</a>
    </div>
  )
}

export default Blog
