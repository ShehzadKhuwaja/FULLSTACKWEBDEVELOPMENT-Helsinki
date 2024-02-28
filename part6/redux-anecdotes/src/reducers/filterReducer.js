import { createSlice } from "@reduxjs/toolkit"

const initialState = ''

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        filteranecdote(state, action) {
            return action.payload
        }
    }
})

export const { filteranecdote } = filterSlice.actions
export default filterSlice.reducer