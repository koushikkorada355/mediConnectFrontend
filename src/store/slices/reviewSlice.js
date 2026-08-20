import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../services/apiClient'

// ============ ASYNC THUNKS ============

// ADD REVIEW (DOCTOR OR HOSPITAL)
export const addReview = createAsyncThunk(
  'review/addReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/reviews', reviewData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review')
    }
  }
)

// GET DOCTOR REVIEWS
export const getDoctorReviews = createAsyncThunk(
  'review/getDoctorReviews',
  async ({ doctorId, page = 1, limit = 10, sortBy = 'recent' }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/reviews/doctor/${doctorId}`, {
        params: { page, limit, sortBy }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor reviews')
    }
  }
)

// GET HOSPITAL REVIEWS
export const getHospitalReviews = createAsyncThunk(
  'review/getHospitalReviews',
  async ({ hospitalId, page = 1, limit = 10, sortBy = 'recent' }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/reviews/hospital/${hospitalId}`, {
        params: { page, limit, sortBy }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospital reviews')
    }
  }
)

// GET USER'S REVIEWS
export const getUserReviews = createAsyncThunk(
  'review/getUserReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/reviews/my-reviews')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your reviews')
    }
  }
)

// UPDATE REVIEW
export const updateReview = createAsyncThunk(
  'review/updateReview',
  async ({ reviewId, updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, updateData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review')
    }
  }
)

// DELETE REVIEW
export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review')
    }
  }
)

// ============ SLICE ============

const initialState = {
  // Doctor reviews
  doctorReviews: {
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    pagination: { page: 1, limit: 10, totalPages: 0 }
  },

  // Hospital reviews
  hospitalReviews: {
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    pagination: { page: 1, limit: 10, totalPages: 0 }
  },

  // User's own reviews
  userReviews: [],

  // Single review being edited
  currentReview: null,

  // State management
  loading: false,
  error: null,
  successMessage: null
}

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    resetReviews: (state) => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    // ---- ADD REVIEW ----
    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.message || 'Review added successfully'
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- GET DOCTOR REVIEWS ----
    builder
      .addCase(getDoctorReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDoctorReviews.fulfilled, (state, action) => {
        state.loading = false
        state.doctorReviews = action.payload.data
      })
      .addCase(getDoctorReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- GET HOSPITAL REVIEWS ----
    builder
      .addCase(getHospitalReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHospitalReviews.fulfilled, (state, action) => {
        state.loading = false
        state.hospitalReviews = action.payload.data
      })
      .addCase(getHospitalReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- GET USER REVIEWS ----
    builder
      .addCase(getUserReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
        state.loading = false
        state.userReviews = action.payload.data
      })
      .addCase(getUserReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- UPDATE REVIEW ----
    builder
      .addCase(updateReview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = 'Review updated successfully'
        state.currentReview = action.payload.data
        
        // Update in userReviews
        const index = state.userReviews.findIndex(r => r._id === action.payload.data._id)
        if (index !== -1) {
          state.userReviews[index] = action.payload.data
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- DELETE REVIEW ----
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = 'Review deleted successfully'
        
        // Remove from userReviews
        if (state.currentReview) {
          state.userReviews = state.userReviews.filter(r => r._id !== state.currentReview._id)
          state.currentReview = null
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearSuccessMessage, resetReviews } = reviewSlice.actions
export default reviewSlice.reducer
