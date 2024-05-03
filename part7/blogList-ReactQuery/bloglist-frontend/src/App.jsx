import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/Loginform'
import BlogForm from './components/BlogForm'
import Togglabel from './components/Togglabel'
import { useMessageDispatch } from './NotificationContext'
import { setnotification, unsetNotification } from './NotificationContext'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const messageDispatch = useMessageDispatch()

    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs.sort((blog1, blog2) => blog2.likes - blog1.likes))
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
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
                username, password
            })

            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

            blogService.setToken(user.token)
            setUser(user)
            setUserName('')
            setPassword('')
        } catch (exception) {
            messageDispatch(setnotification('Wrong username or password', 'error'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        }
    }

    const createBlog = async (BlogObject) => {
        blogFormRef.current.toggleVisibility()
        const returnedBlog = await blogService.create(BlogObject)

        if (returnedBlog) {
            const returnedblogs = await blogService.getAll()
            setBlogs(returnedblogs.sort((blog1, blog2) => blog2.likes - blog1.likes))
            messageDispatch(setnotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        }
    }

    const logout = () => {
        window.localStorage.clear()
        setUser(null)
    }

    const handleLike = (id) => {
        const blog = blogs.find(blog => blog.id === id)
        const changedBlog = { ...blog, likes: blog.likes + 1 }
        blogService
            .update(id, changedBlog)
            .then(() => {
                setBlogs(blogs
                    .map(blog => blog.id !== id ? blog : changedBlog)
                    .sort((blog1, blog2) => blog2.likes - blog1.likes))
            })
            .catch(error => {
                messageDispatch(setnotification(`Blog '${blog.title}' was already removed from server`, 'error'))
                setTimeout(() => {
                    messageDispatch(unsetNotification())
                }, 5000)
            })
    }

    const handleDelete = (id) => {
        const blog = blogs.find(blog => blog.id === id)
        const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
        if (confirmation) {
            blogService
                .deleteBlog(id)
                .then(() => {
                    setBlogs(blogs
                        .filter(blog => blog.id !== id)
                        .sort((blog1, blog2) => blog2.likes - blog1.likes))
                })
                .catch(error => {
                    messageDispatch(setnotification('Unauthorized to delete this blog', 'error'))
                    setTimeout(() => {
                        messageDispatch(unsetNotification())
                    }, 5000)
                })
        }
    }

    if (user === null) {
        return (
            <>
                <Notification />
                <LoginForm
                    username={username}
                    password={password}
                    handleLogin={handleLogin}
                    handleUsernameChange={({ target }) => setUserName(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                />
            </>
        )
    }

    return (
        <div>
            <h2>blogs</h2>

            <Notification />

            {user && <div>
                <p>{user.name} logged in <button onClick={logout}>logout</button></p>
                <Togglabel buttonLabel='create new blog' ref={blogFormRef}>
                    <BlogForm createBlog={createBlog} />
                </Togglabel>
            </div>
            }

            {blogs.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    handleLike={() => handleLike(blog.id)}
                    handleDelete={() => handleDelete(blog.id)}
                    user={user.username}
                />
            )}
        </div>
    )
}

export default App