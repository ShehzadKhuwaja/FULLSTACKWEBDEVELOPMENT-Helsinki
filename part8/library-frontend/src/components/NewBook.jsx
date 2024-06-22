import { useState } from 'react'
import { Form, FloatingLabel, Button, Badge, Row, Col } from 'react-bootstrap'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, GET_GENRES } from '../queries'
import { useMutation, useQuery } from '@apollo/client'
import { useNavigate } from "react-router-dom"

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [genres, setGenres] = useState([])
  const [errors, setErrors] = useState({})

  const all_title = useQuery(ALL_BOOKS)

  let existingTitles = all_title.data?.allBooks
  existingTitles = existingTitles?.map(book => book.title)

  const validate = () => {
    const newErrors = {};
    if (!title) {
      newErrors.title = 'Title is required'
    } else if (existingTitles.includes(title)) {
      newErrors.title = 'Title must be unique'
    }

    if (!author) newErrors.author = 'Author is required'
    if (!published || isNaN(published)) newErrors.published = 'Published year is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [ addBook ] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: GET_GENRES }],
    awaitRefetchQueries: true,
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      console.log(messages)
    }
  })

  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    
    if(validate()) {
      await addBook({ variables: {title, author, published, genres} })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenreInput('')

    navigate('/books')
    }
  }

  const handleAddGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput)) {
      setGenres([...genres, genreInput]);
      setGenreInput(''); // Clear the input field
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setGenres(genres.filter(genre => genre !== genreToRemove));
  };

  return (
    <div>
      <Form onSubmit={submit}>
        <FloatingLabel
          controlId="floatingTitle"
          label="Title"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingAuthor"
          label="Author"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            isInvalid={!!errors.author}
          />
          <Form.Control.Feedback type="invalid">
            {errors.author}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
        controlId="floatingPublished"
        label="Published Year"
        className="mb-3"
        >
          <Form.Control
            type="number"
            placeholder="Published Year"
            min="1000"
            max="9999"
            value={isNaN(published)? '': published}
            onChange={({ target }) => setPublished(parseInt(isNaN(target.value)? '': target.value))}
            isInvalid={!!errors.published}
          />
          <Form.Control.Feedback type="invalid">
            {errors.published}
          </Form.Control.Feedback>
        </FloatingLabel>

        <Row className="align-items-center mb-3">
          <Col xs={9}>
            <FloatingLabel controlId="floatingGenreInput" label="Add Genre">
              <Form.Control
                type="text"
                placeholder="Genre"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col xs={3}>
            <Button variant="secondary" type="button" onClick={handleAddGenre}>
              Add Genre
            </Button>
          </Col>
        </Row>

        <div className="mt-3 mb-3">
          {genres.map((genre, index) => (
            <Badge
              key={index}
              pill
              bg="secondary"
              className="me-2"
              onClick={() => handleRemoveGenre(genre)}
              style={{ cursor: 'pointer' }}
            >
              {genre} <span>&times;</span>
            </Badge>
          ))}
        </div>

        <Button variant="primary" type="submit">
          Create Book
        </Button>
    </Form>
    </div>
  )
}

export default NewBook