import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import blogService from '../services/blogs'
import { setnotification, unsetNotification, useMessageDispatch } from '../NotificationContext'

const BlogForm = ({ blogFormRef }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const queryClient = useQueryClient()
    const messageDispatch = useMessageDispatch()

    const createNewBlogMutation = useMutation({
        mutationFn: blogService.create,
        onSuccess: (returnedBlog) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            messageDispatch(setnotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        },
        onError: () => {
            messageDispatch(setnotification('Unable to create the blog', 'error'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        }
    })

    const addBlog = (event) => {
        event.preventDefault()
        blogFormRef.current.toggleVisibility()
        createNewBlogMutation.mutate({title, author, url})

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <>
            <h1>Create New</h1>
            <form onSubmit={addBlog}>
                <div>
                title:
                    <input
                        type='text'
                        value={title}
                        name='Title'
                        onChange={({ target }) => setTitle(target.value)}
                        id='title-input'
                    />
                </div>
                <div>
                author:
                    <input
                        type='text'
                        value={author}
                        name='Author'
                        onChange={({ target }) => setAuthor(target.value)}
                        id='author-input'
                    />
                </div>
                <div>
                url:
                    <input
                        type='text'
                        value={url}
                        name='Url'
                        onChange={({ target }) => setUrl(target.value)}
                        id='url-input'
                    />
                </div>
                <button type='submit' id='create-button'>create</button>
            </form>
        </>
    )
}

export default BlogForm