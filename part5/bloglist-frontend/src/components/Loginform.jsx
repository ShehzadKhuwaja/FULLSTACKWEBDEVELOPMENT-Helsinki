import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, password, handleUsernameChange, handlePasswordChange }) => {
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
                        onChange={handleUsernameChange}
                        id='username'
                    />
                </div>
                <div>
                    password
                    <input
                        type='password'
                        value={password}
                        name='Password'
                        onChange={handlePasswordChange}
                        id='password'
                    />
                </div>
                <button type='submit' id='login-button'>login</button>
            </form>
        </>
    )
}

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm