import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query allBooks($author: String, $genre: String) {
        allBooks(
            author: $author,
            genre: $genre
        ) {
            title
            author {
                name
            }
            published
        }
    }
`

export const ADD_BOOK = gql`
    mutation addNewBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            author {
                name
            }
            published
        }
    }
`

export const EDIT_BIRTHYEAR = gql`
    mutation updateBirthYear($name: String!, $setBornTo: Int!) {
        editAuthor(
            name: $name,
            setBornTo: $setBornTo
        ) {
            name
            born
        }
    }
`

export const CREATE_USER = gql`
    mutation createNewUser($username: String!, $favoriteGenre: String!) {
        createUser(
            username: $username
            favoriteGenre: $favoriteGenre
        ) {
            username
        }
    }
`

export const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(
            username: $username
            password: $password
        ) {
            value
        }
    }
`

export const GET_GENRES = gql`
    query {
        allGenres
    }
`