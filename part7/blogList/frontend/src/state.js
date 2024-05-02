import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'


const store = configureStore({
    reducer: {
        message: notificationReducer
    }
})

export default store