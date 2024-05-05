import { useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/Loginform'
import BlogForm from './components/BlogForm'
import Togglabel from './components/Togglabel'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import { setUser } from './reducers/authenticationReducer'
import { Routes, Link, Route } from 'react-router-dom'
import User from './components/User'

const Home = ({ user }) => {
    const blogFormRef = useRef()

    return (
        <>
            {user && <div>
                    <Togglabel buttonLabel='create new blog' ref={blogFormRef}>
                        <BlogForm blogFormRef={blogFormRef}/>
                    </Togglabel>
                </div>
            }

            <BlogList user={user.username}/>
        </>
    )
}

const App = () => {
    const user = useSelector(state => state.auth)
    const dispatch = useDispatch()

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

    console.log(user)

    if (user === null) {
        return (
            <>
                <Notification />
                <LoginForm />
            </>
        )
    }

    return (
        <div className='container'>
            <h2>blogs</h2>
            
            <Notification />

            {user && <div>
                <p>{user.name} logged in <button onClick={logout}>logout</button></p>
            </div>
            }

            <div>
            
                <div>
                    <Link to='/users'>users</Link>
                    <Link to='/' style={{ padding: '10px' }}>Home</Link>
                </div>

                <Routes>
                    <Route path='/users' element={<User />} />
                    <Route path='/' element={<Home user={user}/>} />
                </Routes>
            </div>
        </div>
        
    )
}

export default App