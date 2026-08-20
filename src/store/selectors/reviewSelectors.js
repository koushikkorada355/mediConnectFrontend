// ============ DOCTOR REVIEWS SELECTORS ============

export const selectDoctorReviews = (state) => state.review.doctorReviews.reviews || []

export const selectDoctorReviewsLoading = (state) => state.review.loading

export const selectDoctorAverageRating = (state) => state.review.doctorReviews.averageRating

export const selectDoctorTotalReviews = (state) => state.review.doctorReviews.totalReviews

export const selectDoctorRatingBreakdown = (state) => state.review.doctorReviews.ratingBreakdown

export const selectDoctorReviewsPagination = (state) => state.review.doctorReviews.pagination

// ============ HOSPITAL REVIEWS SELECTORS ============

export const selectHospitalReviews = (state) => state.review.hospitalReviews.reviews || []

export const selectHospitalReviewsLoading = (state) => state.review.loading

export const selectHospitalAverageRating = (state) => state.review.hospitalReviews.averageRating

export const selectHospitalTotalReviews = (state) => state.review.hospitalReviews.totalReviews

export const selectHospitalRatingBreakdown = (state) => state.review.hospitalReviews.ratingBreakdown

export const selectHospitalReviewsPagination = (state) => state.review.hospitalReviews.pagination

// ============ USER REVIEWS SELECTORS ============

export const selectUserReviews = (state) => state.review.userReviews

export const selectUserReviewsLoading = (state) => state.review.loading

export const selectUserDoctorReviews = (state) => 
  state.review.userReviews.filter(r => r.reviewType === 'DOCTOR')

export const selectUserHospitalReviews = (state) => 
  state.review.userReviews.filter(r => r.reviewType === 'HOSPITAL')

// ============ CURRENT REVIEW SELECTOR ============

export const selectCurrentReview = (state) => state.review.currentReview

// ============ STATUS SELECTORS ============

export const selectReviewLoading = (state) => state.review.loading

export const selectReviewError = (state) => state.review.error

export const selectReviewSuccess = (state) => state.review.successMessage

// ============ COMPUTED SELECTORS ============

// Get doctor reviews grouped by rating
export const selectDoctorReviewsByRating = (state) => {
  const reviews = state.review.doctorReviews.reviews || []
  const grouped = {
    5: reviews.filter(r => r.rating === 5),
    4: reviews.filter(r => r.rating === 4),
    3: reviews.filter(r => r.rating === 3),
    2: reviews.filter(r => r.rating === 2),
    1: reviews.filter(r => r.rating === 1)
  }
  return grouped
}

// Get hospital reviews grouped by rating
export const selectHospitalReviewsByRating = (state) => {
  const reviews = state.review.hospitalReviews.reviews || []
  const grouped = {
    5: reviews.filter(r => r.rating === 5),
    4: reviews.filter(r => r.rating === 4),
    3: reviews.filter(r => r.rating === 3),
    2: reviews.filter(r => r.rating === 2),
    1: reviews.filter(r => r.rating === 1)
  }
  return grouped
}

// Get verified reviews count
export const selectVerifiedReviewsCount = (state, reviewType) => {
  if (reviewType === 'DOCTOR') {
    return (state.review.doctorReviews.reviews || []).filter(r => r.isVerified).length
  }
  if (reviewType === 'HOSPITAL') {
    return (state.review.hospitalReviews.reviews || []).filter(r => r.isVerified).length
  }
  return 0
}

// Get recent reviews (last 5)
export const selectRecentReviews = (state, limit = 5) => {
  const allReviews = state.review.userReviews
  return allReviews.slice(0, limit)
}

// Get top rated review (highest rating, then most recent)
export const selectTopDoctorReview = (state) => {
  const reviews = state.review.doctorReviews.reviews
  if (!reviews || reviews.length === 0) return null
  return [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating
    return new Date(b.date || 0) - new Date(a.date || 0)
  })[0] || null
}

// Get top rated review for hospital (highest rating, then most recent)
export const selectTopHospitalReview = (state) => {
  const reviews = state.review.hospitalReviews.reviews
  if (!reviews || reviews.length === 0) return null
  return [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating
    return new Date(b.date || 0) - new Date(a.date || 0)
  })[0] || null
}

// Get average rating for display (formatted)
export const selectFormattedDoctorRating = (state) => {
  const rating = state.review.doctorReviews.averageRating
  return rating ? rating.toFixed(1) : '0.0'
}

export const selectFormattedHospitalRating = (state) => {
  const rating = state.review.hospitalReviews.averageRating
  return rating ? rating.toFixed(1) : '0.0'
}

// Check if user has already reviewed (for given doctor/hospital)
export const selectHasUserReviewedDoctor = (state, doctorId) => {
  return state.review.userReviews.some(r => r.reviewType === 'DOCTOR' && r.target === doctorId)
}

export const selectHasUserReviewedHospital = (state, hospitalId) => {
  return state.review.userReviews.some(r => r.reviewType === 'HOSPITAL' && r.target === hospitalId)
}
