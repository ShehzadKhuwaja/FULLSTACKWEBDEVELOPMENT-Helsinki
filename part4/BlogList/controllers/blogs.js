const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0 
  })

  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogRouter
  