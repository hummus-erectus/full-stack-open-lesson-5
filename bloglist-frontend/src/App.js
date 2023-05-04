import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, newLike, removeBlog, newComment } from './reducers/blogReducer'
import { removeUser, userLogin } from './reducers/userReducer'
import { Routes, Route, useMatch } from 'react-router-dom'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import { initializeUsers } from './reducers/usersReducer'
import BlogView from './components/BlogView'
import Navigation from './components/Navigation'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector(({ blog }) => blog)
  const user = useSelector(({ user }) => user)
  const users = useSelector(({ users }) => users)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(userLogin(user))
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))

      dispatch(userLogin(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong username or password', 'error', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListUser')
    dispatch(removeUser(null))
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

  const addComment = async (id, content) => {
    // const blog = blogs.find((n) => n.id === id)
    console.log(content)
    try {
      dispatch(newComment(id, content))
      dispatch(setNotification('Comment added', 'success', 5))
    } catch (error) {
      dispatch(setNotification(error.message, 'error', 5))
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

  const matchUser = useMatch('/users/:id')
  const individualUser = matchUser
    ? users.find(user => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const individualBlog = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null
    //

  return (
    <>
      {user && <Navigation user={user} handleLogout={handleLogout}/>}
      <Notification />
      <h1>Blog App</h1>
      {user === null ? (
        loginForm()
      ) : (
        <>
          <Routes>
            <Route path='/' element=
              {<>
                {blogForm()}

                <div className="blogsList">
                  <h2>Blog list</h2>
                  {blogs
                    .map((blog) => (
                      <Blog
                        key={blog.id}
                        blog={blog}
                      />
                    ))}
                </div>
              </>}
            />
            <Route path='/users' element={<Users />}/>
            <Route path='/users/:id' element={<User individualUser={individualUser}/>}/>
            <Route path='/blogs/:id' element={<BlogView individualBlog={individualBlog} addLike={addLike} deleteBlog={deleteBlog} addComment={addComment}/>}/>

          </Routes>
        </>
      )}
    </>
  )
}

export default App
