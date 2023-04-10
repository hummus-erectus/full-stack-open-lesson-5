import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState(null)

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
    // console.log('logging in with', username, password)

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


  const loginForm = () => (
    <>
      <h2>Login to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
          <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )

  return (
    <div>
      {feedbackMessage && notification()}

      {user === null ?
        loginForm() :
        <>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <h2>Create new entry</h2>

          {blogForm()}

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