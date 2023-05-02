import { useSelector } from 'react-redux'

const User = ({ individualUser }) => {
  const blogs = useSelector(({ blog }) => blog)
  const user = individualUser

  if (!user) {
    return null
  }

  return (
    <>
      <h2>{user}</h2>
      <h3>Added blogs</h3>
      {blogs
        .filter((blog) => blog.user.id === user.id)
        .map((blog) => (
          <li key={blog.id}>
            {blog.name}
          </li>
        ))}
    </>
  )
}

export default User