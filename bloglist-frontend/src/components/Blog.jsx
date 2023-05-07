import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <li className='blog'>
      <Link to={`/blogs/${blog.id}`}><span className="blogTitle">{blog.title}</span> by <span className="blogAuthor">{blog.author}</span></Link>
    </li>
  )
}

export default Blog
