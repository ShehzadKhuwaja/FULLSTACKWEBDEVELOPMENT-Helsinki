const list_Helper = require('../utils/list_helper')

describe('author with the most likes', () => {
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
            title: 'functional programming is very powerful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 20,
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
            title: 'Enigma',
            author: 'Alen turing',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 15,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Enigma',
            author: 'Alen turing',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 2,
            __v: 0
        }
    ]

    test('is the author itself if there is only one author in the list', () => {
        const result = list_Helper.mostLikes(listWithOneAuthor)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 25
        })
    })

    test('is undefined if the list is empty', () => {
        const result = list_Helper.mostLikes([])
        expect(result).toBeUndefined()
    })

    test('is the one that has most likes for the blogs in total', () => {
        const result = list_Helper.mostLikes(listWithMultipleAuthors)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 20
        })
    })
})