// Doctor Selectors
export const selectDoctors = (state) => state.doctor.doctors
export const selectDoctor = (state) => state.doctor.doctor
export const selectMyDoctorProfile = (state) => state.doctor.myProfile
export const selectDoctorPagination = (state) => state.doctor.pagination
export const selectDoctorLoading = (state) => state.doctor.loading
export const selectDoctorError = (state) => state.doctor.error
export const selectDoctorSuccessMessage = (state) => state.doctor.successMessage
