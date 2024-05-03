import { useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/Loginform'
import BlogForm from './components/BlogForm'
import Togglabel from './components/Togglabel'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import { setUser } from './reducers/authenticationReducer'

const App = () => {
    const user = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const blogFormRef = useRef()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user))
            blogService.setToken(user.token)
        }
    }, [])


    const logout = () => {
        window.localStorage.clear()
        dispatch(setUser(null))
    }

    if (user === null) {
        return (
            <>
                <Notification />
                <LoginForm />
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
                    <BlogForm blogFormRef={blogFormRef}/>
                </Togglabel>
            </div>
            }

            <BlogList user={user.username}/>
        </div>
    )
}

export default App