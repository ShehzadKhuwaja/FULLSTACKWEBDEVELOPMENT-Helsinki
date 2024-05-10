import { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../reducers/userReducer'
import { Link } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'

const Users = () => {
    const dispatch = useDispatch()
    const users = useSelector(state => state.users)

    console.log(users)

    useEffect(() => {
        dispatch(getUsers())
    }, [])

    if (users.length === 0) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    return (
        <div>
            <Table striped>
                <thead>
                    <tr>
                        <th>Users</th>
                        <th>blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map(user => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.username}
                                </Link>
                            </td>
                            <td>
                                {user.blogs.length}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Users