import { createSlice } from "@reduxjs/toolkit"


const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    updateVote(state, action) {
      const oldanecdote = state.find(anecdote => anecdote.id === action.payload)
      const updatedanec = {...oldanecdote, votes: oldanecdote.votes + 1}
      return state
        .map(anec => anec.id !== action.payload ? anec : updatedanec)
        .sort((anec1, anec2) => anec2.votes - anec1.votes)
    },
    newAnec(state, action) {
      state.push(action.payload)
      return state.sort((anec1, anec2) => anec2.votes - anec1.votes)
    },
    setAnec(state, action) {
      return action.payload
    }
  }
})

export const { newAnec, updateVote, setAnec } = anecdoteSlice.actions
export default anecdoteSlice.reducer