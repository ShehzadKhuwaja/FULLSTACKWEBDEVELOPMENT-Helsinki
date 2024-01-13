const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObject = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(blog => blog.title)

    expect(title).toContain('Go To Statement Considered Harmful')
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Testing is Essential part of Software Development',
        author: 'Shehzad Khuwaja',
        url: 'https://en.wikipedia.org/wiki/Software_testing',
        likes: 1000
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blogs => blogs.title)
    expect(titles).toContain('Testing is Essential part of Software Development')
})

test('unique identifier property of the blog posts should be named as id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlog = {
        title: 'Testing is Essential part of Software Development',
        author: 'Shehzad Khuwaja',
        url: 'https://en.wikipedia.org/wiki/Software_testing',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const blog = blogsAtEnd.find(blog => blog.title === 'Testing is Essential part of Software Development')
    expect(blog.likes).toEqual(0)
})

test('if the title or url properties are missing from the request data, respond to the request with the status code 400 Bad Request', async () => {
    const newBlog = {
        author: 'Shehzad Khuwaja',
        url: 'https://en.wikipedia.org/wiki/Software_testing',
        likes: 140
    }

    // for missing title
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const newBlogTwo = {
        title: 'Testing is Essential part of Software Development',
        author: 'Shehzad Khuwaja',
        likes: 140
    }

    // for missing url
    await api
        .post('/api/blogs')
        .send(newBlogTwo)
        .expect(400)

    const newBlogThree = {
        author: 'Shehzad Khuwaja',
        likes: 140
    }

    // for missing title and url
    await api
        .post('/api/blogs')
        .send(newBlogThree)
        .expect(400)
})


afterAll(async () => {
    await mongoose.connection.close()
})