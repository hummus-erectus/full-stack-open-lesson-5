import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return(action.payload)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    addLike(state, action) {
      const id = action.payload.id
      const changedBlog = action.payload
      return state.map(blog =>
        blog.id !== id? blog : changedBlog
      )
    },
    deleteBlog(state, action) {
      const id = action.payload.id
      return state.filter((blog) => blog.id !== id)
    }
  }
})

export const { setBlogs, appendBlog, addLike, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    dispatch(setBlogs(sortedBlogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const newLike = id => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const blogToChange = blogs.find(a => a.id === id)
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes+1
    }
    const result = await blogService.update(id, changedBlog)
    dispatch(addLike(result))
  }
}

export const removeBlog = id => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const blogToDelete = blogs.find(a => a.id === id)
    await blogService.remove(id)
    dispatch(deleteBlog(blogToDelete))
  }
}

export default blogSlice.reducer