import { useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/Loginform'
import BlogForm from './components/BlogForm'
import Togglabel from './components/Togglabel'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import { setUser } from './reducers/authenticationReducer'
import { Routes, Link, Route, useMatch, Navigate } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogDetail from './components/BlogDetail'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Button } from 'react-bootstrap'

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

            <BlogList />
        </>
    )
}

const App = () => {
    const user = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const allUsers = useSelector(state => state.users)

    const match = useMatch('/users/:id')
    const matchedUser = match ? allUsers?.find(user => user.id === match.params.id) : null

    const allBlogs = useSelector(state => state.blogs)

    const blogMatch = useMatch('/blogs/:id')
    const blog = blogMatch ? allBlogs?.find(blog => blog.id === blogMatch.params.id) : null 

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

            <div>
                <Navbar bg="light" data-bs-theme="light" collapseOnSelect expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Blogs</Nav.Link>
                            <Nav.Link href="/users">Users</Nav.Link>
                        </Nav>
                        <Nav>
                            <Navbar.Text>Signed in as: {user.name} <Button variant="outline-success" onClick={logout}>logout</Button></Navbar.Text>
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <h2 className="mb-3 mt-3">blogs</h2>
                <Notification />

                <Routes>
                    <Route path='/users' element={<Users />} />
                    <Route path='/' element={<Home user={user}/>} />
                    <Route path='/users/:id' element={matchedUser ? <User user={matchedUser}/>: <Navigate replace to={'/users'}/>} />
                    <Route path='/blogs/:id' element={blog ? <BlogDetail blog={blog} user={user.username}/>: <Navigate to={'/'} />} />
                </Routes>
            </div>

        </div>
        
    )
}

export default App