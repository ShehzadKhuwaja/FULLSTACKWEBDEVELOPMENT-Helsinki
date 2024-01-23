const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

describe('addition of a blog', () => {
    let token = null
    beforeAll(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('testuser', 10) 
        const user = new User({ username: 'testuser', name: 'testuser', password: passwordHash})
        const savedUser = await user.save()

        const userToken = {
            username: 'testuser',
            id: savedUser._id
        }
        token = jwt.sign(userToken, process.env.SECRET)
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
            .set({ Authorization: `bearer ${token}` })
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(blogs => blogs.title)
        expect(titles).toContain('Testing is Essential part of Software Development')
    })

    test('without a valid token blog can not be created', async () => {
        const newBlog = {
            title: 'Testing is Essential part of Software Development',
            author: 'Shehzad Khuwaja',
            url: 'https://en.wikipedia.org/wiki/Software_testing',
            likes: 1000
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set({ Authorization: `bearer ` })
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        expect(response.body.error).toEqual('jwt must be provided')
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
            .set({ Authorization: `bearer ${token}` })
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
            .set({ Authorization: `bearer ${token}` })
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
            .set({ Authorization: `bearer ${token}` })
            .expect(400)
    
        const newBlogThree = {
            author: 'Shehzad Khuwaja',
            likes: 140
        }
    
        // for missing title and url
        await api
            .post('/api/blogs')
            .send(newBlogThree)
            .set({ Authorization: `bearer ${token}` })
            .expect(400)
    })
})



test('unique identifier property of the blog posts should be named as id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})


describe('deletion of a blog', () => {
    let token = null
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('testuser', 10) 
        const user = new User({ username: 'testuser', name: 'testuser', password: passwordHash})
        const savedUser = await user.save()

        const userToken = {
            username: 'testuser',
            id: savedUser._id
        }
        token = jwt.sign(userToken, process.env.SECRET)

        const newBlog = {
            title: 'Testing is Essential part of Software Development',
            author: 'Shehzad Khuwaja',
            url: 'https://en.wikipedia.org/wiki/Software_testing',
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({ Authorization: `bearer ${token}` })
            .expect(201)
            .expect('Content-Type', /application\/json/)

    })
    test('succeeds with the status code of 204 if id is valid', async () => {
        const BlogsAtStart = await helper.blogsInDb()
        const BlogToDelete = BlogsAtStart[0]

        await api
            .delete(`/api/blogs/${BlogToDelete.id}`)
            .set({ Authorization: `bearer ${token}` })
            .expect(204)

        const BlogsAtEnd = await helper.blogsInDb()
        expect(BlogsAtEnd).toHaveLength(BlogsAtStart.length - 1)

        const titles = BlogsAtEnd.map(blog => blog.title)

        expect(titles).not.toContain(BlogToDelete.title) 
    })
})

describe('updation of a blog', () => {
    test('succeeds with the status code of 200 if a valid update is performed', async () => {
        const BlogsAtStart = await helper.blogsInDb()

        const BlogToUpdate = {
            title: BlogsAtStart[0].title,
            author: BlogsAtStart[0].author,
            url: BlogsAtStart[0].url,
            likes: 200
        }
        
        const response = await api
                            .put(`/api/blogs/${BlogsAtStart[0].id}`)
                            .send(BlogToUpdate)
                            .expect(200)
                            .expect('Content-Type', /application\/json/)

        const BlogsAtEnd = await helper.blogsInDb()
        expect(BlogsAtEnd).toHaveLength(helper.initialBlogs.length)

        expect(response.body).toEqual({...BlogToUpdate, id: BlogsAtStart[0].id})
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})