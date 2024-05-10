import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlog } from '../reducers/blogReducer'
import Blog from './Blog'
import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'


const BlogList = () => {

    const dispatch = useDispatch()
    const blogs = useSelector(state => state.blogs)

    useEffect(() => {
        dispatch(initializeBlog())
    }, [])

    if (blogs.length === 0) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
        <div>
            <ListGroup>
                {
                    blogs.map(blog => <Blog key={blog.id} blog={blog} />)
                    
                }
            </ListGroup>
            
        </div>
    )
}

export default BlogList