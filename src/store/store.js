import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import hospitalReducer from './slices/hospitalSlice'
import doctorReducer from './slices/doctorSlice'
import bloodBankReducer from './slices/bloodBankSlice'

import reviewReducer from './slices/reviewSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    hospital: hospitalReducer,
    doctor: doctorReducer,
    bloodBank: bloodBankReducer,

    review: reviewReducer,
  },
})

export default store
