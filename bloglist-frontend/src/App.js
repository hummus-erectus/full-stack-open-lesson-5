import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, newLike, removeBlog } from './reducers/blogReducer'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector(({ blog }) => blog)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong username or password', 'error', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      dispatch(createBlog(blogObject))
      dispatch(setNotification(`${blogObject.title} by ${blogObject.author} added`, 'success', 5))
    } catch (error) {
      dispatch(setNotification(error.message, 'error', 5))
    }
  }

  const addLike = async (id) => {
    const blog = blogs.find((n) => n.id === id)
    try {
      dispatch(newLike(id))
      dispatch(setNotification(`You liked "${blog.title}"`, 'success', 5))
    } catch (error) {
      dispatch(setNotification(`${blog.title} was already removed from the server`, 'error', 5))
    }
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find((n) => n.id === id)

    if (window.confirm(`Do you really want to delete ${blog.title}?`)) {
      try {
        dispatch(removeBlog(id))
        dispatch(setNotification(`Successfully removed ${blog.title} by ${blog.author}`, 'success', 5))
      } catch (error) {
        dispatch(setNotification(error.message, 'error', 5))
      }
    }
  }

  const loginForm = () => {


    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <Notification />

      {user === null ? (
        loginForm()
      ) : (
        <>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout} className="logoutButton">
            logout
          </button>

          {blogForm()}

          <h2>Blogs</h2>
          <div className="blogsList">
            {blogs
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  addLike={() => addLike(blog.id)}
                  deleteBlog={() => deleteBlog(blog.id)}
                  user={user}
                />
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
