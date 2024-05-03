import { useState } from 'react'
import PropTypes from 'prop-types'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { setnotification, unsetNotification, useMessageDispatch } from '../NotificationContext'

const Blog = ({ blog, user }) => {
    const [visible, setVisible] = useState(false)
    const queryClient = useQueryClient()
    const messageDispatch = useMessageDispatch()

    const updateBlogMutation = useMutation({
        mutationFn: blogService.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            messageDispatch(setnotification(`You Liked ${blog.title} blog`, 'success'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        },
        onError: () => {
            messageDispatch(setnotification(`Blog '${blog.title}' was already removed from server`, 'error'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        }
    })

    const deleteBlogMutation = useMutation({
        mutationFn: blogService.deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            messageDispatch(setnotification(`Blog ${blog.title} deleted`, 'success'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        },
        onError: () => {
            messageDispatch(setnotification('Unauthorized to delete this blog', 'error'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        }
    })

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

    const handleLike = () => {
        updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
    }

    const handleDelete = () => {
        const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
        if (confirmation) deleteBlogMutation.mutate(blog.id)
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