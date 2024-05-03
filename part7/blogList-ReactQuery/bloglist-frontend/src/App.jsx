import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/Loginform'
import BlogForm from './components/BlogForm'
import Togglabel from './components/Togglabel'
import { useQuery } from '@tanstack/react-query'
import { useUserValue, useUserDispatch, setUser } from './AuthenticationContent'

const App = () => {
    const user = useUserValue()
    const userDispatch = useUserDispatch()

    const blogFormRef = useRef()

    const blogResult = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll
    })

    const blogs = blogResult.data?.sort((blog1, blog2) => blog2.likes - blog1.likes)
    console.log(blogs)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            userDispatch(setUser(user))
            blogService.setToken(user.token)
        }
    }, [])

    const logout = () => {
        window.localStorage.clear()
        userDispatch(setUser(null))
    }

    if (user === null) {
        return (
            <>
                <Notification />
                <LoginForm />
            </>
        )
    }

    if ( blogResult.isLoading ) {
        return <div>loading data...</div>
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

            {blogs?.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    user={user.username}
                />
            )}
        </div>
    )
}

export default App