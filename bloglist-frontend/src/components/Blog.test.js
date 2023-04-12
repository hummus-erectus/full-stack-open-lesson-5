import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but not URL or number of likes', async () => {
  const blog = {
    title: 'A new blog',
    author: 'Mr Blog',
    url: 'www.wowee.org/yikes',
    likes: 50,
    user: {
      name: 'john Smith',
      username:'JohnDaKillah',
      id:'34hf93hf98h39fh3'
    }
  }

  const { container } = render(<Blog blog={blog}/>)

  const titleAndAuthor = container.querySelector('titleAndAuthor')
  expect(titleAndAuthor).toBeDefined()

  const url = container.querySelector('url')
  expect(url).toBeNull()

  const likes = container.querySelector('likes')
  expect(likes).toBeNull()

})

test('clicking the button reveals url and likes', async () => {
  const blog = {
    title: 'A new blog',
    author: 'Mr Blog',
    url: 'www.wowee.org/yikes',
    likes: 50,
    user: {
      name: 'john Smith',
      username:'JohnDaKillah',
      id:'34hf93hf98h39fh3'
    }
  }

  const mockUser = {
    name: 'john Smith',
    username:'JohnDaKillah',
    id:'34hf93hf98h39fh3'
  }

  const { container } = render(<Blog blog={blog} user={mockUser}/>)

  const user = userEvent.setup()
  const button = container.querySelector('.toggleButton')
  await user.click(button)

  const url = container.querySelector('url')
  expect(url).toBeDefined()

  const likes = container.querySelector('likes')
  expect(likes).toBeDefined()
})