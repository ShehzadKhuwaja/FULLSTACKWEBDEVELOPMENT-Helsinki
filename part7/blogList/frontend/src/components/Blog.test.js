import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let blog, container, likeHandler, deleteHandler = null
beforeEach(() => {
    blog = {
        title: 'testing blog one',
        author: 'tester',
        url: 'https://google.com',
        user: { username: 'tester' },
        likes: 0
    }

    likeHandler = jest.fn()
    deleteHandler = jest.fn()
    const user = 'tester'

    container = render(<Blog blog={blog} handleLike={likeHandler} handleDelete={deleteHandler} user={user} />).container
})

test('blog renders the blog\'s title and author, but does not render its URL or number of likes by default.', () => {
    const div = container.querySelector('.bloginfo')

    expect(div).toHaveTextContent(
        `${blog.title} ${blog.author}`
    )

    const detailDiv = container.querySelector('.bloginfodetails')
    expect(detailDiv).toBeNull()
})

test('blog\'s URL and number of likes are shown when the show button isclicked.', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.bloginfo')

    expect(div).toHaveTextContent(
        `${blog.title} ${blog.author}`
    )

    const blogUrl = container.querySelector('.blogUrl')

    expect(blogUrl).toHaveTextContent(blog.url)

    const blogLikes = container.querySelector('.blogLikes')

    expect(blogLikes).toHaveTextContent(blog.likes)
})

test('if the like button is clicked twice, the event handler the component received as props is called twice.', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText ('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeHandler.mock.calls).toHaveLength(2)
})

