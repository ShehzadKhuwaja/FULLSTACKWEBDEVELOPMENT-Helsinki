import { Table, Container } from 'react-bootstrap';

const Authors = ({ authors }) => {

  return (
    <Container className="mt-5">
      <h2>Authors</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Author Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{!author.born ? '-': author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default Authors
