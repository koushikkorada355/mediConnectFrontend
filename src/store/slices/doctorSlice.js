import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../services/apiClient'

// ============ ASYNC THUNKS ============

// GET ALL DOCTORS (with filters & pagination)
export const getAllDoctors = createAsyncThunk(
  'doctor/getAllDoctors',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/doctor', { params: filters })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors')
    }
  }
)

// SYSTEM ADMIN: CREATE DOCTOR ACCOUNT
export const createDoctorAccount = createAsyncThunk(
  'doctor/createDoctorAccount',
  async (doctorData, { rejectWithValue }) => {
    try {
      if (doctorData instanceof FormData) {
        const authData = localStorage.getItem('auth')
        const token = authData ? JSON.parse(authData)?.token : null

        const response = await fetch('https://mediconnect-backend-two.vercel.app/api/superadmin/create-doctor', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: doctorData,
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to create doctor account')
        }

        return data
      }

      const response = await apiClient.post('/superadmin/create-doctor', doctorData)
      return response.data
    } catch (error) {
      console.error('[createDoctorAccount] request failed:', error.response?.data || error.message)
      return rejectWithValue(error.message || error.response?.data?.message || 'Failed to create doctor account')
    }
  }
)

// HOSPITAL ADMIN: ADD DOCTOR TO HOSPITAL
export const addDoctorToHospital = createAsyncThunk(
  'doctor/addDoctorToHospital',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/hospitaladmin/doctors/add', data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add doctor to hospital')
    }
  }
)

// HOSPITAL ADMIN: GET HOSPITAL DOCTORS
export const getHospitalDoctors = createAsyncThunk(
  'doctor/getHospitalDoctors',
  async (hospitalId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/hospitaladmin/doctors/${hospitalId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospital doctors')
    }
  }
)

// GET DOCTOR BY ID
export const getDoctorById = createAsyncThunk(
  'doctor/getDoctorById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/doctor/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor')
    }
  }
)

// GET MY DOCTOR PROFILE (authenticated)
export const getMyDoctorProfile = createAsyncThunk(
  'doctor/getMyDoctorProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/doctor/profile/me')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor profile')
    }
  }
)

// CREATE OR UPDATE DOCTOR PROFILE (with image upload)
export const createOrUpdateDoctorProfile = createAsyncThunk(
  'doctor/createOrUpdateDoctorProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/doctor/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update doctor profile')
    }
  }
)

// DELETE DOCTOR
export const deleteDoctor = createAsyncThunk(
  'doctor/deleteDoctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/doctor/${id}`)
      return { ...response.data, deletedId: id }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete doctor')
    }
  }
)

// ============ SLICE ============

const doctorSlice = createSlice({
  name: 'doctor',
  initialState: {
    doctors: [],
    doctor: null,
    myProfile: null,
    pagination: null,
    loading: false,
    error: null,
    successMessage: null,
    hospitalDoctors: [],
  },
  reducers: {
    clearDoctorError: (state) => {
      state.error = null
    },
    clearDoctorSuccess: (state) => {
      state.successMessage = null
    },
    clearDoctorDetail: (state) => {
      state.doctor = null
    },
  },
  extraReducers: (builder) => {
    builder

      // ---- GET ALL DOCTORS ----
      .addCase(getAllDoctors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = action.payload.data
        state.pagination = action.payload.pagination || null
      })
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---- GET HOSPITAL DOCTORS ----
      .addCase(getHospitalDoctors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHospitalDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.hospitalDoctors = action.payload.data || action.payload
      })
      .addCase(getHospitalDoctors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---- CREATE DOCTOR ACCOUNT ----
      .addCase(createDoctorAccount.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createDoctorAccount.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.message
      })
      .addCase(createDoctorAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---- ADD DOCTOR TO HOSPITAL ----
      .addCase(addDoctorToHospital.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(addDoctorToHospital.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.message
        if (action.payload.data) {
          state.hospitalDoctors.push(action.payload.data)
        }
      })
      .addCase(addDoctorToHospital.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---- GET DOCTOR BY ID ----
      .addCase(getDoctorById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDoctorById.fulfilled, (state, action) => {
        state.loading = false
        state.doctor = action.payload.data
      })
      .addCase(getDoctorById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---- GET MY DOCTOR PROFILE ----
      .addCase(getMyDoctorProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMyDoctorProfile.fulfilled, (state, action) => {
        state.loading = false
        state.myProfile = action.payload.data
      })
      .addCase(getMyDoctorProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---- CREATE/UPDATE DOCTOR PROFILE ----
      .addCase(createOrUpdateDoctorProfile.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createOrUpdateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false
        state.myProfile = action.payload.doctor
        state.successMessage = action.payload.message
      })
      .addCase(createOrUpdateDoctorProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---- DELETE DOCTOR ----
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = state.doctors.filter(d => d._id !== action.payload.deletedId)
        state.successMessage = action.payload.message
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearDoctorError, clearDoctorSuccess, clearDoctorDetail } = doctorSlice.actions
export default doctorSlice.reducer
