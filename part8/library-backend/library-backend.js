const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const mongoose = require('mongoose')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

mongoose.set('strictQuery', false)
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
    allGenres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
        if (!args.author && !args.genre) return Book.find({}).populate('author')
 
        if(args.author && args.genre) {
          let books = await Book.find({genres: { $in: [args.genre] }}).populate('author')
          books = books.filter(book => book.author.name === args.author)
          return books
        }
        else if (args.genre) return Book.find({genres: { $in: [args.genre] }}).populate('author')
        else {
          const books = await Book.find({}).populate('author')
          return books.filter(book => book.author.name === args.author )
        } 
    },
    allAuthors: async () => Author.find({}),

    allGenres: async () => {
      const uniqueGenres = await Book.aggregate([
        { $unwind: "$genres" },
        { $group: { _id: "$genres" } },
        { $sort: { _id: 1 } } // Optional: sort genres alphabetically
      ])
  
      // Extract genres from the aggregation result
      return uniqueGenres.map(doc => doc._id)
    }
  },
  Author: {
    bookCount: async ({ name }) => {
      let books = await Book.find({}).populate('author')
      books = books.filter(book => book.author.name === name)
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
        const author = await Author.findOne({ name: args.author })
        const user = context.currentUser

        if (!user) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }

        let savedAuthor = null

        if (!author) {
          const newAuthor = new Author({ name: args.author })
          try {
            savedAuthor = await newAuthor.save()
          } catch (error) {
            if (error.name === 'ValidationError') {
              // Handling validation errors (e.g., minlength)
              for (field in error.errors) {
                if (error.errors[field].kind === 'minlength') {
                  throw new GraphQLError(`Error: ${field} is too short, minimum length is ${error.errors[field].properties.minlength}`, {
                    extensions: {
                      code: 'BAD_USER_INPUT',
                      invalidArgs: args.author,
                      error
                    }
                  })
                }
              }
            } 
            // Handling other possible errors
            throw new GraphQLError('Can not Create Book', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args,
                error
              }
            })
            
          }
        } else {
          savedAuthor = author
        }

        const newBook = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: savedAuthor.id
        })

        try {
          await newBook.save()
        } catch (error) {
          console.log(error)
          if (error.name === 'ValidationError') {
            // Handling validation errors (e.g., minlength)
            for (field in error.errors) {
              if (error.errors[field].kind === 'minlength') {
                throw new GraphQLError(`Error: ${field} is too short, minimum length is ${error.errors[field].properties.minlength}`, {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.title,
                    error
                  }
                })
              }
              else if (error.errors[field].kind === 'unique') {
                // Handling unique constraint errors
                throw new GraphQLError('Book name must be unique', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.title,
                    error
                  }
                })
              }
            }
          } else {
            // Handling other possible errors
            throw new GraphQLError('Can not Create Book', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.title,
                error
              }
            })
          }
        }
        return newBook.populate('author')
    },
    editAuthor: async (root, args, context) => {
        const user = context.currentUser

        if (!user) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }

        const author = await Author.findOne({ name: args.name })
        if (!author) return null

        author.born = args.setBornTo
        await author.save()
        return author
    },

    createUser: async (root, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre })
      return user.save()
        .catch(error => {
          throw GraphQLError('Creating the User failed', {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          })
        })
    },

    login: async (root, { username, password }) => {
      const user = await User.findOne({ username: username})

      if (!user || password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          code: 'BAD_USER_INPUT'
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization: null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})