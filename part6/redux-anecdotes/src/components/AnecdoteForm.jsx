import { useDispatch } from 'react-redux'
import { newAnec } from "../reducers/anecdoteReducer"
import { set, remove } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const anecdote = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnecdote(anecdote))
        dispatch(setNotification(`you added a new anecdote ${anecdote}`, 1000))
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name='anecdote'/></div>
                <button>create</button>
            </form>
        </>
    )
}

export default AnecdoteForm