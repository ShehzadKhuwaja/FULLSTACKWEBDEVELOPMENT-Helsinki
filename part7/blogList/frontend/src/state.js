import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import authenticationReducer from './reducers/authenticationReducer'
import userReducer from './reducers/userReducer'
import commentReducer from './reducers/commentReducer'


const store = configureStore({
    reducer: {
        message: notificationReducer,
        blogs: blogReducer,
        auth: authenticationReducer,
        users: userReducer,
        comments: commentReducer,
    }
})

export default store