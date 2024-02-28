import axios from 'axios'

const baseURL = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseURL)
    return response.data
}

const createNew = async (anec) => {
    const object = {content: anec, votes: 0}
    const response = await axios.post(baseURL, object)
    return response.data
}

const updateAnecdote = async (id, newAnec) => {
    const response = await axios.put(`${baseURL}/${id}`, newAnec)
    return response.data
}

export default {
    getAll,
    createNew,
    updateAnecdote
}