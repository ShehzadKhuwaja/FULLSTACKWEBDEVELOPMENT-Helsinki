import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'

const Blog = ({ blog }) => {

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <ListGroup.Item action variant="light">
            <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </ListGroup.Item>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired
}

export default Blog