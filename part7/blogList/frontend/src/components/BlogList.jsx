import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlog } from '../reducers/blogReducer'
import Blog from './Blog'


const BlogList = ({ user }) => {

    const dispatch = useDispatch()
    const blogs = useSelector(state => state.blogs)

    useEffect(() => {
        dispatch(initializeBlog())
    }, [])

    return (
        <div>
            {
                blogs.map(blog => <Blog key={blog.id} blog={blog} user={user} />)
            }
        </div>
    )
}

export default BlogList