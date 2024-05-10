import { createSlice } from "@reduxjs/toolkit"
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'

const blogSlice = createSlice({
    name: 'blog',
    initialState: [],
    reducers: {
        setAll(state, action) {
            return action.payload
        },
        create(state, action) {
            console.log(action.payload)
            state.push(action.payload)
        },
        update(state, action) {
            return state.map(blog => action.payload.id !== blog.id ? blog : action.payload)
        },
        remove(state, action) {
            return state.filter(blog => blog.id !== action.payload)
        },
        sort(state, action) {
            return state.sort((blog1, blog2) => blog2.likes - blog1.likes)
        },
    }
})

export const { setAll, create, update, remove, sort } = blogSlice.actions

export const initializeBlog = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setAll(blogs))
        dispatch(sort())
    }
}

export const createBlog = (blog) => {
    return async dispatch => {
        const newBlog = await blogService.create(blog)
        dispatch(create(newBlog))
        dispatch(sort())
        dispatch(setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'success', 5000))
    }
}

export const updateBlog = (id, blog) => {
    return async dispatch => {
        try {
            const updatedBlog = await blogService.update(id, blog)
            dispatch(update(updatedBlog))
            dispatch(sort())
            dispatch(setNotification(`You have Liked ${blog.title} blog by ${blog.author}`, 'success', 5000))
        }
        catch (error) {
            dispatch(setNotification(`Blog '${blog.title}' was already removed from server`, 'error', 5000))
        }
    }
}

export const deleteBlog = (blog) => {
    return async dispatch => {
        try {
            await blogService.deleteBlog(blog.id)
            dispatch(remove(blog.id))
            dispatch(sort())
            dispatch(setNotification(`Blog ${blog.title} deleted`, 'success', 5000))
        } catch (error) {
            dispatch(setNotification('Unauthorized to delete this blog', 'error', 5000))
        }
    }
}

export default blogSlice.reducer