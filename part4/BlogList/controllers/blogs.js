const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    user: user.id,
    url: body.url,
    likes: body.likes ? body.likes : 0 
  })

  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  const savedBlog = await newBlog.save()

  await savedBlog.populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog._id) 
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(id => id.toString() !== request.params.id)
    await user.save()
    return response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'token invalid' })
  } 
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  await updatedBlog.populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

blogRouter.post('/:id/comments', async (request, response ) => {
  const body = request.body

  if (!body.comment) {
    return response.status(400).end()
  }

  const comment = new Comment({
    blogId: request.params.id,
    comment: body.comment
  })

  const savedComment = await comment.save()

  const blog = await Blog.findById(request.params.id)
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  response.status(201).json(savedComment)

})

blogRouter.get('/:id/comments', async (request, response) => {
  const id = request.params.id
  const comments = await Comment.find({ blogId: id })

  response.status(200).json(comments)
})

module.exports = blogRouter
  