import { createSlice } from "@reduxjs/toolkit"

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState,
  reducers: {
    updateVote(state, action) {
      const oldanecdote = state.find(anecdote => anecdote.id === action.payload)
      const updatedanec = {...oldanecdote, votes: oldanecdote.votes + 1}
      return state
        .map(anec => anec.id !== action.payload ? anec : updatedanec)
        .sort((anec1, anec2) => anec2.votes - anec1.votes)
    },
    newAnec(state, action) {
      state.push(asObject(action.payload))
      return state.sort((anec1, anec2) => anec2.votes - anec1.votes)
    }
  }
})

export const { newAnec, updateVote } = anecdoteSlice.actions
export default anecdoteSlice.reducer