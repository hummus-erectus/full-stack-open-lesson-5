import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', async () => {
  const blog = {
    title: 'A new blog',
    author: 'Mr Blog',
    url: 'www.wowee.org/yikes',
    likes: 50
  }

  render(<Blog blog={blog} />)

  const titleAndAuthor = screen.getByText('A new blog Mr Blog')
  expect(titleAndAuthor).toBeDefined()

  const url = screen.queryByText('www.wowee.org/yikes')
  expect(url).toBeNull()


})