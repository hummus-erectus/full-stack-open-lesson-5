import { useState, useEffect, useRef } from 'react'
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

  const blogFormRef = useRef()

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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))


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

  const addLike = async (id) => {
    const blog = blogs.find(n => n.id === id)
    const updatedBlog = { ...blog, likes: blog.likes+1 }
    // console.log('updatedblog', updatedBlog)

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      // console.log('returnedBlog', returnedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (error) {
      setFeedbackMessage({
        message: `Blog '${blog.title} was already removed from the server`,
        type: 'error'
      })
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(n => n.id === id)

    if (window.confirm(`Do you really want to delete ${blog.title}?`)){
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id!== id))
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

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )


  return (
    <div>
      {feedbackMessage && notification()}

      {user === null ?
        loginForm() :
        <>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          {blogForm()}

          <h2>Blogs</h2>
          {blogs.sort((a,b) => a.likes - b.likes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              addLike={() => addLike(blog.id)}
              deleteBlog={() => deleteBlog(blog.id)}
              user={user}
            />
          )}
        </>
      }

    </div>
  )
}

export default App