import { configureStore } from "@reduxjs/toolkit"
import filterReducer from "./reducers/filterReducer"
import anecdotereducer from './reducers/anecdoteReducer'
import notificationReducer from "./reducers/notificationReducer"

const store = configureStore({
    reducer: {
        anecdotes: anecdotereducer,
        filter: filterReducer,
        message: notificationReducer
    }
})

export default store