import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      console.log(loggedUserJSON)
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
          <div>
            username
              <input 
              type='text' 
              value={username} 
              name='Username' 
              onChange={({ target }) => setUserName(target.value)}
              />
          </div>
          <div>
            password
              <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
              />
          </div>
          <button type='submit'>login</button>
      </form>
    </>
  )

  const addBlog = (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setSuccessMessage(`a new blog ${title} by ${author} added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000);
      })
  }

  const blogForm = () => (
    <>
      <h1>Create New</h1>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
          type='text'
          value={title}
          name='Title'
          onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
          author:
          <input
          type='text'
          value={author}
          name='Author'
          onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
          url:
          <input
          type='text'
          value={url}
          name='Url'
          onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button type='submit'>create</button>
      </form>
    </>
    
  )

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }
  
  if (user === null) {
    console.log(user)
    return (
      <>
        <Notification message={ errorMessage } type='error' />
        { loginForm() }
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={ successMessage } type='success'/>

      {user && <div>
        <p>{user.name} logged in <button onClick={logout}>logout</button></p>
        {blogForm()}
        </div>
      }

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App