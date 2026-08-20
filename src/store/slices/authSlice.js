import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'https://mediconnect-backend-two.vercel.app/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/user/register', {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'USER',
      })

      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Registration failed'
      )
    }
  }
)

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email: userData.email,
        password: userData.password,
      })

      // Backend returns: { token, role }
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
      )
    }
  }
)

// Initialize state from localStorage if available
const storedAuth = localStorage.getItem('auth')
const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null

const initialState = {
  isLoggedIn: parsedAuth?.isLoggedIn || false,
  token: parsedAuth?.token || null,
  role: parsedAuth?.role || null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false
      state.token = null
      state.role = null
      state.loading = false
      state.error = null
      localStorage.removeItem('auth')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isLoggedIn = false
      })

    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isLoggedIn = true
        state.token = action.payload.token
        state.role = action.payload.role
        state.error = null
        // Persist to localStorage
        localStorage.setItem('auth', JSON.stringify({
          isLoggedIn: true,
          token: action.payload.token,
          role: action.payload.role,
        }))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isLoggedIn = false
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
