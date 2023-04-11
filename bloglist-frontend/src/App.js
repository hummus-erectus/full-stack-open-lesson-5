import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState(null)
  // const [loginVisible, setLoginVisible] = useState(false)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

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
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogListUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setFeedbackMessage({
        message: 'Wrong username or password',
        type: 'error'
      })
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setFeedbackMessage({
        message: `${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 5000)
    } catch (error) {
      setFeedbackMessage({
        message: error.message,
        type: 'error'
      })
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 5000)
    }
  }

  const notification = () => (
    <div className={`feedback ${feedbackMessage.type} `}>
        {feedbackMessage.message}
    </div>
  )

  const loginForm = () => {
    // const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    // const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        {/* <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div> */}
        {/* <div style={showWhenVisible}> */}
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          {/* <button onClick={() => setLoginVisible(false)}>cancel</button> */}
        {/* </div> */}
      </div>
    )
  }


  return (
    <div>
      {feedbackMessage && notification()}

      {user === null ?
        loginForm() :
        <>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <h2>Create new entry</h2>

          <Togglable buttonLabel="new note">
            <BlogForm
              onSubmit={addBlog}
              title={title}
              author={author}
              url={url}
              handleTitleChange={({ target }) => setTitle(target.value)}
              handleAuthorChange={({ target }) => setAuthor(target.value)}
              handleUrlChange={({ target }) => setUrl(target.value)}
            />
          </Togglable>

          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      }

    </div>
  )
}

export default App