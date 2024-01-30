import { useState } from "react"

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
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{!visible ? 'view' : 'hide'}</button>
      {visible && 
      <div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.username}</div>
        {user === blog.user.username && <div><button style={removeStyle} onClick={handleDelete}>remove</button></div>}
      </div>
      }
    </div>
  )
    
}

export default Blog