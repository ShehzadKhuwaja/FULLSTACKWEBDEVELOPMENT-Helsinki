const list_Helper = require('../utils/list_helper')

describe('author with the most blogs', () => {
    const listWithOneAuthor = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 5,
          __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'hello world ',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
          }
      ]

    const listWithMultipleAuthors = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Superman Killed by Batman',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 15,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Superman Killed by Batman',
            author: 'Batman',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 15,
            __v: 0
        },
    ]

    test('is the author itself if list has only one author', () => {
        const result = list_Helper.mostBlogs(listWithOneAuthor)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 2
        })
    })

    test('is undefined if list is empty', () => {
        const result = list_Helper.mostBlogs([])
        expect(result).toBeUndefined()
    })

    test('is the author having most number of blogs in the list', () => {
        const result = list_Helper.mostBlogs(listWithMultipleAuthors)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 2
        })
    })
})