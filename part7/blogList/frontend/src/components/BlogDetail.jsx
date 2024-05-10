import { useDispatch, useSelector } from "react-redux"
import { deleteBlog, updateBlog } from "../reducers/blogReducer"
import { useNavigate } from "react-router-dom"
import { Button, Card, Spinner } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import { addnewComment, initializeComment } from "../reducers/commentReducer"
import { useEffect, useState } from "react"
import ListGroup from 'react-bootstrap/ListGroup'

const BlogDetail = ({ blog, user  }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [comment, setComment] = useState('')

    const comments = useSelector(state => state.comments)

    useEffect(() => {
        dispatch(initializeComment(blog.id))
    }, [])

    const handleDelete = () => {
        const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
        if (confirmation) {
            dispatch(deleteBlog(blog))
            navigate('/')
        }
    }

    const handleLike = () => {
        const updatedBlog = { ...blog, likes: blog.likes + 1 }
        dispatch(updateBlog(blog.id, updatedBlog))
    }

    const addComment = () => {
        dispatch(addnewComment(blog.id, comment))
        setComment('')
    }


    return (
        <div>

            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Text>
                    <a href={blog.url}>{blog.url}</a>
                    </Card.Text>
                    <Card.Text>
                    {blog.likes} likes 
                    <Button variant="primary" onClick={handleLike} className="ms-2">like</Button>
                    </Card.Text>
                    <Card.Text>
                    added by {blog.user.username}
                    </Card.Text>
                    {user === blog.user.username && 
                    <Card.Text>
                        <Button variant="danger" onClick={handleDelete}>remove</Button>
                    </Card.Text>
                    }
                </Card.Body>
            </Card>

            <h2 className="mb-3">Comment Section</h2>

            <Stack direction="horizontal" gap={3}>
                <Form.Control style={{ flex: 1 }} placeholder="Leave a comment here" value={comment} onChange={(event) => setComment(event.target.value)} />
                <Button variant="primary" onClick={addComment}>Add Comment</Button>
            </Stack>

            {!comments && (
                <Spinner animation="border" role="status" className="mt-3">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}

            {comments?.length === 0 ? (
                <div className="mt-3" style={{ fontFamily: 'sans-serif', fontSize: '18px', fontWeight: '150' }}>Be the first one to leave a comment</div>
            ) : (
                <div className="mt-3">
                    <ListGroup>
                        {
                            comments?.map(comment => <ListGroup.Item key={comment.id} className="mb-3">{comment.comment}</ListGroup.Item>)
                        }
                    </ListGroup>
                </div>
            )}
        </div>
    )
}

export default BlogDetail