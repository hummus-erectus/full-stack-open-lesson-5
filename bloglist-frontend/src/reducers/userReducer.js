import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return (action.payload)
    },
    removeUser() {
      return null
    }

  }
})

export const { setUser, removeUser } = userSlice.actions

export const userLogin = (user) => {
  return dispatch => {
    blogService.setToken(user.token)
    dispatch(setUser(user))
  }
}

// export const userLogout = () => {
//   return dispatch => {
//     blogService.removeToken()
//     dispatch(removeUser())
//   }
// }

export default userSlice.reducer