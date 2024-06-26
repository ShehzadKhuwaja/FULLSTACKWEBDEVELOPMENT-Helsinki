import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token }
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    await axios.delete(`${baseUrl}/${id}`, config)
}

const getComments = (id) => {
    const request = axios.get(`${baseUrl}/${id}/comments`)
    return request.then(response => response.data)
}

const postComment = (id, comment) => {
    const request = axios.post(`${baseUrl}/${id}/comments`, {comment})
    return request.then(response => response.data)
}

export default { getAll, setToken, create, update, deleteBlog, getComments, postComment }
