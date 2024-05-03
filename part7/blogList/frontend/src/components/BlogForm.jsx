import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = ({ blogFormRef }) => {
    const dispatch = useDispatch()

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        blogFormRef.current.toggleVisibility()
        dispatch(createBlog({
            title,
            author,
            url
        }))

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