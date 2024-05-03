import { useState } from 'react'
import PropTypes from 'prop-types'
import { deleteBlog, updateBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'


const Blog = ({ blog, user }) => {
    const [visible, setVisible] = useState(false)
    const dispatch = useDispatch()

    const handleLike = () => {
        const updatedBlog = { ...blog, likes: blog.likes + 1 }
        dispatch(updateBlog(blog.id, updatedBlog))
    }

    const handleDelete = () => {
        const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
        if (confirmation) {
            dispatch(deleteBlog(blog))
        }
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const removeStyle = {
        background: 'lightblue',
        borderRadius: 5,
    }

    return (
        <div style={blogStyle} className="bloginfo">
            {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{!visible ? 'view' : 'hide'}</button>
            {visible &&
            <div className='bloginfodetails'>
                <div className='blogUrl'><a href={blog.url}>{blog.url}</a></div>
                <div className='blogLikes'>likes {blog.likes} <button onClick={handleLike}>like</button></div>
                <div className='blogUser'>{blog.user.username}</div>
                {user === blog.user.username && <div><button style={removeStyle} onClick={handleDelete}>remove</button></div>}
            </div>
            }
        </div>
    )
}

Blog.propTypes = {
    user: PropTypes.string.isRequired,
    blog: PropTypes.object.isRequired
}

export default Blog