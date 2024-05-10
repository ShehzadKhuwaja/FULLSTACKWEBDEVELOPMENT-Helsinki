import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
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
            <Form onSubmit={addBlog}>
                <Form.Group controlId="formTitle" className="mb-3 mt-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter title"
                    name="title"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formAuthor" className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter author"
                    name="author"
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formURL" className="mb-3">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter URL"
                    name="URL"
                    value={url}
                    onChange={({ target }) => setUrl(target.value)}
                    />
                </Form.Group>

                <Button variant="success" type='submit' id='create-button' className="mb-3">Create</Button>
            </Form>
        </>
    )
}

export default BlogForm