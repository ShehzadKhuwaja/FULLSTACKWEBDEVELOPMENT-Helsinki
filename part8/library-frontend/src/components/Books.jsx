import { useQuery } from "@apollo/client"
import { ALL_BOOKS, GET_GENRES } from "../queries"
import Spinner from 'react-bootstrap/Spinner'
import { Table, Container, Form } from 'react-bootstrap'
import { useState } from "react"


const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('')

  const result = useQuery(ALL_BOOKS,{
    variables: { genre: selectedGenre }
  })

  console.log(result.data)

  const getGenres = useQuery(GET_GENRES, {
    fetchPolicy: 'no-cache'
  })

  if (result.loading) {
    return (
      <Spinner animation="grow" />
    )
  }

  const books = result.data.allBooks

  const genres = getGenres.data?.allGenres

  const handleGenreChange = (event) => {
    const genre = event.target.value
    setSelectedGenre(genre)
  }

  console.log(genres)

  return (
    <>
    <Form.Group controlId="genreSelect">
      <Form.Label style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Select Genre</Form.Label>
      <Form.Control as="select" value={selectedGenre} onChange={handleGenreChange} style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '0.25rem' }}>
        <option value=''>All Genres</option>
        {genres && (
          genres.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))
        )
        }
      </Form.Control>
    </Form.Group>
    <Container className="mt-5">
        <h2>Books</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </Table>
    </Container>
    </>
  )
}

export default Books
