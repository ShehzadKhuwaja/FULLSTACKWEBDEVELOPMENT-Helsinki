import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from './services/anecdote'
import { useMessageDispatch } from './notificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatchMessage = useMessageDispatch()

  const newVoteMutation = useMutation({
    mutationFn: anecdoteService.updateVote,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anec => anec.id !== anecdote.id ? anec: anecdote))
      dispatchMessage({ type: 'notify', payload: `anecdote '${anecdote.content}' voted` })
      setTimeout(() => {
        dispatchMessage({ type: 'notify', payload: null })
      }, 5000);
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    newVoteMutation.mutate(anecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: false,
    refetchOnWindowFocus: false
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  else if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
