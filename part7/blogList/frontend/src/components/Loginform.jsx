import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLogin } from '../reducers/authenticationReducer'

const LoginForm = () => {
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const handleLogin = (event) => {
        event.preventDefault()
        dispatch(setLogin(username, password))
        setUserName('')
        setPassword('')
    }
    
    return (
        <>
            <h1>log in to application</h1>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type='text'
                        value={username}
                        name='Username'
                        onChange={({ target }) => setUserName(target.value)}
                        id='username'
                    />
                </div>
                <div>
                    password
                    <input
                        type='password'
                        value={password}
                        name='Password'
                        onChange={({ target }) => setPassword(target.value)}
                        id='password'
                    />
                </div>
                <button type='submit' id='login-button'>login</button>
            </form>
        </>
    )
}

export default LoginForm