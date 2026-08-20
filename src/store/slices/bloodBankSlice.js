import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../services/apiClient'

// ============ ASYNC THUNKS ============

// CREATE BLOOD BANK
export const createBloodBank = createAsyncThunk(
  'bloodBank/createBloodBank',
  async (bloodBankData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/bloodbanks', bloodBankData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blood bank')
    }
  }
)

// GET ALL BLOOD BANKS (with filters)
export const getAllBloodBanks = createAsyncThunk(
  'bloodBank/getAllBloodBanks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/bloodbanks', { params: filters })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blood banks')
    }
  }
)

// GET BLOOD BANK BY ID
export const getBloodBankById = createAsyncThunk(
  'bloodBank/getBloodBankById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/bloodbanks/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blood bank')
    }
  }
)

// GET BLOOD BANKS BY BLOOD GROUP
export const getBloodBanksByGroup = createAsyncThunk(
  'bloodBank/getBloodBanksByGroup',
  async ({ bloodGroup, minUnits }, { rejectWithValue }) => {
    try {
      const params = {}
      if (minUnits) params.minUnits = minUnits
      const response = await apiClient.get(`/bloodbanks/group/${bloodGroup}`, { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blood banks by group')
    }
  }
)

// SEARCH NEARBY BLOOD BANKS
export const searchNearbyBloodBanks = createAsyncThunk(
  'bloodBank/searchNearbyBloodBanks',
  async ({ lat, lng, radius = 10000 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/bloodbanks/nearby', {
        params: { lat, lng, radius }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nearby blood banks')
    }
  }
)

// UPDATE BLOOD BANK
export const updateBloodBank = createAsyncThunk(
  'bloodBank/updateBloodBank',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/bloodbanks/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blood bank')
    }
  }
)

// DELETE BLOOD BANK
export const deleteBloodBank = createAsyncThunk(
  'bloodBank/deleteBloodBank',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/bloodbanks/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blood bank')
    }
  }
)

// ============ INITIAL STATE ============

const initialState = {
  bloodBanks: [],
  bloodBank: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  filters: {
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  },
  nearbyBloodBanks: [],
  groupBloodBanks: [],
  loading: false,
  error: null,
  successMessage: null,
}

// ============ SLICE ============

const bloodBankSlice = createSlice({
  name: 'bloodBank',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    clearBloodBank: (state) => {
      state.bloodBank = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    // CREATE BLOOD BANK
    builder
      .addCase(createBloodBank.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBloodBank.fulfilled, (state, action) => {
        state.loading = false
        state.bloodBank = action.payload.data || action.payload
        state.successMessage = 'Blood bank created successfully'
      })
      .addCase(createBloodBank.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET ALL BLOOD BANKS
    builder
      .addCase(getAllBloodBanks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllBloodBanks.fulfilled, (state, action) => {
        state.loading = false
        state.bloodBanks = action.payload.data || action.payload
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(getAllBloodBanks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET BLOOD BANK BY ID
    builder
      .addCase(getBloodBankById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getBloodBankById.fulfilled, (state, action) => {
        state.loading = false
        state.bloodBank = action.payload.data || action.payload
      })
      .addCase(getBloodBankById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET BLOOD BANKS BY GROUP
    builder
      .addCase(getBloodBanksByGroup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getBloodBanksByGroup.fulfilled, (state, action) => {
        state.loading = false
        state.groupBloodBanks = action.payload.data || action.payload
      })
      .addCase(getBloodBanksByGroup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // SEARCH NEARBY BLOOD BANKS
    builder
      .addCase(searchNearbyBloodBanks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchNearbyBloodBanks.fulfilled, (state, action) => {
        state.loading = false
        state.nearbyBloodBanks = action.payload.data || action.payload
      })
      .addCase(searchNearbyBloodBanks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // UPDATE BLOOD BANK
    builder
      .addCase(updateBloodBank.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBloodBank.fulfilled, (state, action) => {
        state.loading = false
        state.bloodBank = action.payload.data || action.payload
        state.successMessage = 'Blood bank updated successfully'
      })
      .addCase(updateBloodBank.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // DELETE BLOOD BANK
    builder
      .addCase(deleteBloodBank.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBloodBank.fulfilled, (state) => {
        state.loading = false
        state.bloodBank = null
        state.successMessage = 'Blood bank deleted successfully'
      })
      .addCase(deleteBloodBank.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// ============ ACTIONS ============

export const { clearMessages, clearBloodBank, setFilters, resetFilters } = bloodBankSlice.actions

export default bloodBankSlice.reducer
