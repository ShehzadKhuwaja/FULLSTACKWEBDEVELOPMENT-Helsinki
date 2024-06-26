import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { Routes, Route } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import BirthYearForm from './components/BirthYearForm'
import { ALL_AUTHORS } from "./queries"
import { useQuery, useApolloClient } from "@apollo/client"
import Spinner from 'react-bootstrap/Spinner'
import Login from "./components/LoginForm"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Recommendation from "./components/Recommendation"


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))

  const result = useQuery(ALL_AUTHORS)

  const client = useApolloClient()

  const navigate = useNavigate()

  if (result.loading) {
    return (
      <Spinner animation="grow" />
    )
  }

  const authors = result.data.allAuthors

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/books')
  }


  return (
    <div className="container">
      <div className="mb-3">
        <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Library</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Authors</Nav.Link>
            <Nav.Link href="/books">Books</Nav.Link>
            {
              token && (
                <>
                <Nav.Link href="/recommendation">Recommendation</Nav.Link>
                <Nav.Link href="/addBook">Add Book</Nav.Link>
                <Nav.Link href="/birthyear">Set BirthYear</Nav.Link>
                </>
              )
            }
          </Nav>
          <Nav className="justify-content-end">
            {!token ? <Nav.Link href="/login">Login</Nav.Link>: <Nav.Link as={Button} onClick={logout} className="btn btn-primary">Logout</Nav.Link> }
          </Nav>
        </Container>
        </Navbar>
      </div>

      <Routes>
        <Route path="/" element={<Authors authors={authors} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/addBook" element={<NewBook />} />
        <Route path="/birthyear" element={<BirthYearForm authors={authors} />} />
        <Route path="/login" element={<Login setToken={setToken}/>}/>
        <Route path="/recommendation" element={<Recommendation />}/>
      </Routes>

    </div>
  );
};

export default App;
