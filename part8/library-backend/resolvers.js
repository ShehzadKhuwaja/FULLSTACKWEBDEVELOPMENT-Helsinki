const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const pubsub = new PubSub()

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

          pubsub.publish('BOOK_ADDED', { bookAdded: newBook.populate('author') })

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
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
      },
    },
}

module.exports = resolvers