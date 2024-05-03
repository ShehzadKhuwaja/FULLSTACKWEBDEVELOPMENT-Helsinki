import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import authenticationReducer from './reducers/authenticationReducer'


const store = configureStore({
    reducer: {
        message: notificationReducer,
        blogs: blogReducer,
        auth: authenticationReducer 
    }
})

export default store