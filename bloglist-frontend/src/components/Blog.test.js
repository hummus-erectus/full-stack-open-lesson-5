import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
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

  render(<Blog blog={blog} />)

  const titleAndAuthor = screen.getByText('A new blog Mr Blog')
  expect(titleAndAuthor).toBeDefined()

  const url = screen.queryByText('www.wowee.org/yikes')
  expect(url).toBeNull()

  const likes = screen.queryByText('50')
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

  render(<Blog blog={blog} user={mockUser}/>)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const url = screen.getByText('www.wowee.org/yikes')
  expect(url).toBeDefined()

  const likes = screen.getByText('50')
  expect(likes).toBeDefined()
})