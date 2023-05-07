import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, newLike, removeBlog, newComment } from './reducers/blogReducer'
import { removeUser, userLogin } from './reducers/userReducer'
import { Routes, Route, useMatch } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogsList from './components/BlogsList'
import Togglable from './components/Togglable'
import loginService from './services/login'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import { initializeUsers } from './reducers/usersReducer'
import BlogView from './components/BlogView'
import Navigation from './components/Navigation'
import GlobalStyles from './components/styles/Global'
import { ThemeProvider } from 'styled-components'
import { Container } from './components/styles/Container.styled'

const theme = {
  colors: {
    primary: '#65C3C8',
    primaryContent: '#00393C',
    secondary: '#EF9FBC',
    secondaryContent: '#50001D',
    base: '#FAF7F5',
    baseContent: '291334'
  },
  mobile: '768px',
}

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

      await dispatch(userLogin(user))
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
      await dispatch(createBlog(blogObject))
      dispatch(setNotification(`${blogObject.title} by ${blogObject.author} added`, 'success', 5))
    } catch (error) {
      dispatch(setNotification(error.message, 'error', 5))
    }
  }

  const addLike = async (id) => {
    const blog = blogs.find((n) => n.id === id)
    try {
      await dispatch(newLike(id))
      dispatch(setNotification(`You liked "${blog.title}"`, 'success', 5))
    } catch (error) {
      dispatch(setNotification(`${blog.title} was already removed from the server`, 'error', 5))
    }
  }

  const addComment = async (id, content) => {
    console.log(content)
    try {
      await dispatch(newComment(id, content))
      dispatch(setNotification('Comment added', 'success', 5))
    } catch (error) {
      dispatch(setNotification(error.message, 'error', 5))
    }
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find((n) => n.id === id)

    if (window.confirm(`Do you really want to delete ${blog.title}?`)) {
      try {
        await dispatch(removeBlog(id))
        dispatch(setNotification(`Successfully removed ${blog.title} by ${blog.author}`, 'success', 5))
      } catch (error) {
        dispatch(setNotification(error.message, 'error', 5))
      }
    }
  }

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
    <ThemeProvider theme = { theme }>
      <>
        <GlobalStyles />
        {user && <Navigation user={user} handleLogout={handleLogout}/>}
        <Notification />
        <Container>
          <h1>Blog App</h1>
          {user === null ? (
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          ) : (
            <>
              <Routes>
                <Route path='/' element=
                  {
                    <>
                      <Togglable buttonLabel="new blog" ref={blogFormRef}>
                        <BlogForm createBlog={addBlog} />
                      </Togglable>

                      <BlogsList blogs={blogs}/>
                    </>
                  }
                />
                <Route path='/users' element={<Users />}/>
                <Route path='/users/:id' element={<User individualUser={individualUser}/>}/>
                <Route path='/blogs/:id' element={<BlogView individualBlog={individualBlog} addLike={addLike} deleteBlog={deleteBlog} addComment={addComment}/>}/>

              </Routes>
            </>
          )}
        </Container>
      </>
    </ThemeProvider>
  )
}

export default App
