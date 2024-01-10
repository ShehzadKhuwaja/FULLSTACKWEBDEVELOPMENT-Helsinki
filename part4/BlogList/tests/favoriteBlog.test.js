const list_Helper = require('../utils/list_helper')

describe('favorite blog', () => {

    const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 5,
          __v: 0
        }
      ]

    const listWithTwoBlogs = [
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
        }
    ]

    test('is one with most likes', () => {
        const result = list_Helper.favoriteBlog(listWithTwoBlogs)
        expect(result).toEqual({
            title: listWithTwoBlogs[1].title,
            author: listWithTwoBlogs[1].author,
            likes: listWithTwoBlogs[1].likes
        })
    })

    test('is the blog itself when list has only one blog', () => {
        const result = list_Helper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual({
            title: listWithOneBlog[0].title,
            author: listWithOneBlog[0].author,
            likes: listWithOneBlog[0].likes
        })
    })

    test('is empty object is there are no blogs', () => {
        const result = list_Helper.favoriteBlog([])
        expect(result).toEqual({})
    })
})