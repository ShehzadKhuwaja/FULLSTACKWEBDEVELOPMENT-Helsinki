import { useDispatch } from 'react-redux'
import { updateVote } from '../reducers/anecdoteReducer'
import { useSelector } from 'react-redux'
import { set, remove } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.filter === '') {
            return state.anecdotes
        }
        return state.anecdotes.filter(({ content }) => content.includes(state.filter))
    })
    const dispatch = useDispatch()

    const vote = (id) => {
        console.log('vote', id)
        dispatch(updateVote(id))
        const anecToShow = anecdotes.find(anec => anec.id === id)
        anecToShow && dispatch(set(`you voted '${anecToShow.content}'`))
        setTimeout(() => {
            dispatch(remove(null))
        }, 5000);
    }

    return (
        <>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList