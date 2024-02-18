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

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  let updatedState = null
  
  switch (action.type) {
    case 'ADDVOTE':
      const oldanecdote = state.find(anecdote => anecdote.id === action.payload.id)
      const updatedanec = {...oldanecdote, votes: oldanecdote.votes + 1}
      updatedState = state.map(anec => anec.id !== action.payload.id ? anec : updatedanec)
      return updatedState.sort((anec1, anec2) => anec2.votes - anec1.votes)
    case 'NEW_ANEC':
      updatedState = [...state, action.payload]
      return updatedState.sort((anec1, anec2) => anec2.votes - anec1.votes)
    default:
      return state
  }

}

export const updateVote = (id) => {
  return {
    type: 'ADDVOTE',
    payload: { id }
  }
}

export const newAnec = (anecdote) => {
  return {
    type: 'NEW_ANEC',
    payload: asObject(anecdote)
  }
}

export default reducer