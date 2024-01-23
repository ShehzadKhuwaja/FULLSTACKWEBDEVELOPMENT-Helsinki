const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bycrypt = require('bcrypt')
const User = require('../models/user')


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bycrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with fresh username', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length + 1)

        const usernames = userAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if user already taken', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "superuser"   
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length)
            
    })

    test('creation fails with proper statuscode and message if invalid request is made', async () => {
        const userAtStart = await helper.usersInDb()

        const invalidUser = {
            username: 'test3',
            name: 'test3'
        }

        const result = await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password is missing')

        const invalidUser2 = {
            username: 'test3',
            name: 'test3',
            password: '12'
        }

        const result2 = await api
            .post('/api/users')
            .send(invalidUser2)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result2.body.error).toContain('password length should be atleast 3')

        const invalidUser3 = {
            username: 'te',
            name: 'test3',
            password: '12334'
        }

        const result3 = await api
            .post('/api/users')
            .send(invalidUser3)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result3.body.error).toContain('User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3).')

        const invalidUser4 = {
            name: 'test',
            password: '1234'
        }

        const result4 = await api
            .post('/api/users')
            .send(invalidUser4)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result4.body.error).toContain('User validation failed: username: Path `username` is required.')

        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length)
    })
})