import axios from "axios"

const baseURL = 'http://localhost:3001/anecdotes'

const getAll = () => {
    return axios.get(baseURL).then(res => res.data)
}

const createNew = (content) => {
    return axios.post(baseURL, { content, votes: 0 }).then(res => res.data)
}

const updateVote = (anecdote) => {
    return axios
        .put(`${baseURL}/${anecdote.id}`, {...anecdote, votes: anecdote.votes + 1})
        .then(res => res.data)
}

export default {
    getAll,
    createNew,
    updateVote
}