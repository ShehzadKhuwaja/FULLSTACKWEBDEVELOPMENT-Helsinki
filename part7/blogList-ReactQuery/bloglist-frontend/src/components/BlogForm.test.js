import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('the form calls the event handler it received as props with the right details when a new blog is created.', async () => {
    const createBlog = jest.fn()
    const handleDelete = jest.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} handleDelete={handleDelete} />)

    const sendButton = screen.getByText('create')

    const titleInput = container.querySelector('#title-input')
    await user.type(titleInput, 'Frontent testing')
    const authorInput = container.querySelector('#author-input')
    await user.type(authorInput, 'tester')
    const urlInput = container.querySelector('#url-input')
    await user.type(urlInput, 'https://helloworldthisisTesting')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Frontent testing')
    expect(createBlog.mock.calls[0][0].author).toBe('tester')
    expect(createBlog.mock.calls[0][0].url).toBe('https://helloworldthisisTesting')
})