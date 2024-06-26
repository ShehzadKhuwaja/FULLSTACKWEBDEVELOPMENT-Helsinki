import { Container, Spinner, Table } from "react-bootstrap"
import { USER_INFO, ALL_BOOKS } from '../queries'
import { useQuery } from "@apollo/client"


const Recommendation = () => {

  const userInfo = useQuery(USER_INFO)

  const favoriteGenre = userInfo.data?.me.favoriteGenre
  
  //console.log(favoriteGenre)

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre }
  })

  const books = result.data?.allBooks

  if (result.loading) <Spinner animation="grow" />

  return (
    <Container>
        <h2>Recommendations</h2>
        <p>Books in your favorite genre <b>pattern</b></p>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {books?.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </Table>
    </Container>
  )
}

export default Recommendation