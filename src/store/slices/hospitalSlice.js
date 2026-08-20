import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../services/apiClient'

// ============ ASYNC THUNKS ============

// CREATE HOSPITAL
export const createHospital = createAsyncThunk(
  'hospital/createHospital',
  async (hospitalData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/hospital', hospitalData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create hospital')
    }
  }
)

// GET ALL HOSPITALS
export const getAllHospitals = createAsyncThunk(
  'hospital/getAllHospitals',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/hospital', { params: filters })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospitals')
    }
  }
)

// GET HOSPITAL BY ID
export const getHospitalById = createAsyncThunk(
  'hospital/getHospitalById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/hospital/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospital')
    }
  }
)

// GET HOSPITALS BY DISEASE
export const getHospitalsByDisease = createAsyncThunk(
  'hospital/getHospitalsByDisease',
  async (disease, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/hospital/filter/disease', { params: { disease } })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospitals')
    }
  }
)

// GET HOSPITALS BY LOCATION
export const getHospitalsByLocation = createAsyncThunk(
  'hospital/getHospitalsByLocation',
  async ({ lat, lng, maxDistance = 50000 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/hospital/location/nearby', {
        params: { lat, lng, maxDistance }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospitals')
    }
  }
)

// GET HOSPITAL BY ADMIN USER ID
export const getHospitalByAdminUserId = createAsyncThunk(
  'hospital/getHospitalByAdminUserId',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/hospital/admin/me')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospital')
    }
  }
)

// UPDATE HOSPITAL
export const updateHospital = createAsyncThunk(
  'hospital/updateHospital',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/hospital/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update hospital')
    }
  }
)

// UPDATE BED MANAGEMENT
export const updateBedManagement = createAsyncThunk(
  'hospital/updateBedManagement',
  async ({ id, beds }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/hospital/${id}/beds`, beds)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update beds')
    }
  }
)

// UPDATE FACILITIES
export const updateFacilities = createAsyncThunk(
  'hospital/updateFacilities',
  async ({ id, facilities }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/hospital/${id}/facilities`, { facilities })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update facilities')
    }
  }
)

// UPDATE OPERATING HOURS
export const updateOperatingHours = createAsyncThunk(
  'hospital/updateOperatingHours',
  async ({ id, operatingHours }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/hospital/${id}/operating-hours`, { operatingHours })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update operating hours')
    }
  }
)

// UPDATE PAYMENT METHODS
export const updatePaymentMethods = createAsyncThunk(
  'hospital/updatePaymentMethods',
  async ({ id, paymentMethods }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/hospital/${id}/payment-methods`, { paymentMethods })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment methods')
    }
  }
)

// UPDATE INSURANCE ACCEPTED
export const updateInsuranceAccepted = createAsyncThunk(
  'hospital/updateInsuranceAccepted',
  async ({ id, insuranceAccepted }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/hospital/${id}/insurance`, { insuranceAccepted })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update insurance')
    }
  }
)

// UPDATE ACCREDITATIONS
export const updateAccreditations = createAsyncThunk(
  'hospital/updateAccreditations',
  async ({ id, accreditations }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/hospital/${id}/accreditations`, { accreditations })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update accreditations')
    }
  }
)

// ADD GALLERY IMAGE
export const addGalleryImage = createAsyncThunk(
  'hospital/addGalleryImage',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/hospital/${id}/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add image')
    }
  }
)

// DELETE GALLERY IMAGE
export const deleteGalleryImage = createAsyncThunk(
  'hospital/deleteGalleryImage',
  async ({ id, imageId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/hospital/${id}/gallery/${imageId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete image')
    }
  }
)

// GET HOSPITAL STATISTICS
export const getHospitalStatistics = createAsyncThunk(
  'hospital/getHospitalStatistics',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/hospital/${id}/statistics`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics')
    }
  }
)

// DELETE HOSPITAL
export const deleteHospital = createAsyncThunk(
  'hospital/deleteHospital',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/hospital/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete hospital')
    }
  }
)

// ============ INITIAL STATE ============

const initialState = {
  hospitals: [],
  hospital: null,
  statistics: null,
  loading: false,
  error: null,
  successMessage: null,
}

// ============ SLICE ============

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    // CREATE HOSPITAL
    builder
      .addCase(createHospital.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createHospital.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Hospital created successfully'
      })
      .addCase(createHospital.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET ALL HOSPITALS
    builder
      .addCase(getAllHospitals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllHospitals.fulfilled, (state, action) => {
        state.loading = false
        state.hospitals = action.payload.data || action.payload
      })
      .addCase(getAllHospitals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET HOSPITAL BY ID
    builder
      .addCase(getHospitalById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHospitalById.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
      })
      .addCase(getHospitalById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET HOSPITALS BY DISEASE
    builder
      .addCase(getHospitalsByDisease.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHospitalsByDisease.fulfilled, (state, action) => {
        state.loading = false
        state.hospitals = action.payload.data || action.payload
      })
      .addCase(getHospitalsByDisease.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET HOSPITALS BY LOCATION
    builder
      .addCase(getHospitalsByLocation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHospitalsByLocation.fulfilled, (state, action) => {
        state.loading = false
        state.hospitals = action.payload.data || action.payload
      })
      .addCase(getHospitalsByLocation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET HOSPITAL BY ADMIN USER ID
    builder
      .addCase(getHospitalByAdminUserId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHospitalByAdminUserId.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
      })
      .addCase(getHospitalByAdminUserId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // UPDATE HOSPITAL
    builder
      .addCase(updateHospital.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateHospital.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Hospital updated successfully'
      })
      .addCase(updateHospital.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // UPDATE BED MANAGEMENT
    builder
      .addCase(updateBedManagement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBedManagement.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Beds updated successfully'
      })
      .addCase(updateBedManagement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // UPDATE FACILITIES
    builder
      .addCase(updateFacilities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateFacilities.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Facilities updated successfully'
      })
      .addCase(updateFacilities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // UPDATE OPERATING HOURS
    builder
      .addCase(updateOperatingHours.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOperatingHours.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Operating hours updated successfully'
      })
      .addCase(updateOperatingHours.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // UPDATE PAYMENT METHODS
    builder
      .addCase(updatePaymentMethods.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePaymentMethods.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Payment methods updated successfully'
      })
      .addCase(updatePaymentMethods.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // UPDATE INSURANCE ACCEPTED
    builder
      .addCase(updateInsuranceAccepted.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInsuranceAccepted.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Insurance updated successfully'
      })
      .addCase(updateInsuranceAccepted.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // UPDATE ACCREDITATIONS
    builder
      .addCase(updateAccreditations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAccreditations.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Accreditations updated successfully'
      })
      .addCase(updateAccreditations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ADD GALLERY IMAGE
    builder
      .addCase(addGalleryImage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addGalleryImage.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Image added successfully'
      })
      .addCase(addGalleryImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // DELETE GALLERY IMAGE
    builder
      .addCase(deleteGalleryImage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = action.payload.data || action.payload
        state.successMessage = 'Image deleted successfully'
      })
      .addCase(deleteGalleryImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // GET HOSPITAL STATISTICS
    builder
      .addCase(getHospitalStatistics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHospitalStatistics.fulfilled, (state, action) => {
        state.loading = false
        state.statistics = action.payload.data || action.payload
      })
      .addCase(getHospitalStatistics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // DELETE HOSPITAL
    builder
      .addCase(deleteHospital.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteHospital.fulfilled, (state, action) => {
        state.loading = false
        state.hospital = null
        state.successMessage = 'Hospital deleted successfully'
      })
      .addCase(deleteHospital.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearMessages } = hospitalSlice.actions
export default hospitalSlice.reducer
