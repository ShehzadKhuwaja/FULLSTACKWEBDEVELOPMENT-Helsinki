import PropTypes from 'prop-types'
import { useUserDispatch, setUser } from '../AuthenticationContent'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setnotification, unsetNotification, useMessageDispatch } from '../NotificationContext'
import { useState } from 'react'


const LoginForm = () => {
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const messageDispatch = useMessageDispatch()
    const userDispatch = useUserDispatch()

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

            blogService.setToken(user.token)
            userDispatch(setUser(user))
            setUserName('')
            setPassword('')
        } catch (exception) {
            messageDispatch(setnotification('Wrong username or password', 'error'))
            setTimeout(() => {
                messageDispatch(unsetNotification())
            }, 5000)
        }
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