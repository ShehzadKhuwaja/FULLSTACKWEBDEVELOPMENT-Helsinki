import { createSlice } from "@reduxjs/toolkit"
import blogService from '../services/blogs'
import { setNotification } from "./notificationReducer"

const commentSlice = createSlice({
    name: 'comment',
    initialState: null,
    reducers: {
        setComments(state, action) {
            return action.payload
        },
        addComment(state, action) {
            state.push(action.payload)
        }
    }
})

export const { setComments, addComment } = commentSlice.actions  

export const initializeComment = (id) => {
    return async dispatch => {
        const comments = await blogService.getComments(id)
        dispatch(setComments(comments))
    }
}

export const addnewComment = (id, comment) => {
    return async dispatch => {
        try {
            const newComment = await blogService.postComment(id, comment)
            dispatch(addComment(newComment))
            dispatch(setNotification(`Comment Added`, 'success', 5000))
        }
        catch (error) {
            dispatch(setNotification('Unable to create comment', 'error', 5000))
        }
    }
}

export default commentSlice.reducer