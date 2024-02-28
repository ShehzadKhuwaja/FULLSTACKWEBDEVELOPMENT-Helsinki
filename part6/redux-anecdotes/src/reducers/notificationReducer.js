import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        set(state, action) {
            return action.payload
        },
        remove(state, action) {
            return null
        }
    }
})

export const { set, remove } = notificationSlice.actions

export const setNotification = (message, time) => {
    return async dispatch => {
        dispatch(set(message))
        setTimeout(() => {
            dispatch(remove())
        }, time)
    }
}
export default notificationSlice.reducer