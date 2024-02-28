import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"


const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    updateVote(state, action) {
      return state
        .map(anec => anec.id !== action.payload.id ? anec : action.payload)
        .sort((anec1, anec2) => anec2.votes - anec1.votes)
    },
    newAnec(state, action) {
      state.push(action.payload)
      return state.sort((anec1, anec2) => anec2.votes - anec1.votes)
    },
    setAnec(state, action) {
      return action.payload.sort((anec1, anec2) => anec2.votes - anec1.votes)
    }
  }
})

export const { newAnec, updateVote, setAnec } = anecdoteSlice.actions

export const initializeAnecdote = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnec(anecdotes))
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch(newAnec(newAnecdote))
  }
}

export const updateAnecdote = (id, anecdote) => {
  return async dispatch => {
    const updateObj = {...anecdote, votes: anecdote.votes + 1} 
    const updatedAnecdote = await anecdoteService.updateAnecdote(id, updateObj)
    dispatch(updateVote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer