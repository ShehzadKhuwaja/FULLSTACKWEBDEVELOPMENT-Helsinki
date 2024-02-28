import { useDispatch } from 'react-redux'
import { newAnec } from "../reducers/anecdoteReducer"
import { set, remove } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const anecdote = event.target.anecdote.value
        event.target.anecdote.value = ''
        const newAnecdote = await anecdoteService.createNew(anecdote)
        dispatch(newAnec(newAnecdote))
        dispatch(set(`you added a new anecdote ${anecdote}`))
        setTimeout(() => {
            dispatch(remove(null))
        }, 5000);
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