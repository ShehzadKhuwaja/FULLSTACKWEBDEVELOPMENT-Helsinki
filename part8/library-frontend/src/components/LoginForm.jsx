import { useState, useEffect } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { useMutation } from "@apollo/client"
import {  LOGIN } from '../queries'
import { useNavigate } from "react-router-dom"

const LoginForm = ({ setToken }) => {

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)

      setUserName('')
      setPassword('')

      navigate('/books')
    }
  }, [result.data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    login({ variables: { username, password } })
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  )
}

export default LoginForm