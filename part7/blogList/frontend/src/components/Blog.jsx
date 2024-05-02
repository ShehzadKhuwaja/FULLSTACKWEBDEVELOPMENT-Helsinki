import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
    const [visible, setVisible] = useState(false)

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
    handleLike: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    blog: PropTypes.object.isRequired
}

export default Blog