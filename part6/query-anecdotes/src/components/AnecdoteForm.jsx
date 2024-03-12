import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdote'
import { useMessageDispatch } from '../notificationContext'

const AnecdoteForm = () => {
  const queryClient =  useQueryClient() 
  const dispatchMessage = useMessageDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      dispatchMessage({ type: 'notify', payload: `A new anecdote "${newAnecdote.content}" is created` })
      setTimeout(() => {
        dispatchMessage({ type: 'notify', payload: null })
      }, 5000);
    },
    onError: (response) => {
      dispatchMessage({ type: 'notify', payload: response.response.data.error})
      setTimeout(() => {
        dispatchMessage({ type: 'notify', payload: null })
      }, 5000);
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
