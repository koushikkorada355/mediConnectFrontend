// Basic Hospital Selectors
export const selectHospitals = (state) => state.hospital.hospitals
export const selectHospital = (state) => state.hospital.hospital
export const selectHospitalDetail = (state) => state.hospital.hospital
export const selectStatistics = (state) => state.hospital.statistics
export const selectLoading = (state) => state.hospital.loading
export const selectHospitalLoading = (state) => state.hospital.loading
export const selectError = (state) => state.hospital.error
export const selectSuccessMessage = (state) => state.hospital.successMessage
