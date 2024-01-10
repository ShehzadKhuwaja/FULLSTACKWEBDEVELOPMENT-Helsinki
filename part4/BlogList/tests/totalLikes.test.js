const list_Helper = require('../utils/list_helper')

describe('total likes', () => {
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
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 15,
            __v: 0
          }
      ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = list_Helper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })

    test('of empty list is zero', () => {
        const result = list_Helper.totalLikes([])
        expect(result).toBe(0)
    })

    test('of a bigger list is calculated right', () => {
        const result = list_Helper.totalLikes(listWithTwoBlogs)
        expect(result).toBe(20)
    })
})