import axios from 'axios'
const baseUrl = '/api/persons'

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const getAll = () => {
    return axios.get(baseUrl)
}

const erase = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { create, getAll, erase, update }