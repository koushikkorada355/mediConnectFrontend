// Blood Bank Selectors

export const selectBloodBanks = (state) => state.bloodBank.bloodBanks

export const selectBloodBank = (state) => state.bloodBank.bloodBank

export const selectBloodBankPagination = (state) => state.bloodBank.pagination

export const selectBloodBankFilters = (state) => state.bloodBank.filters

export const selectNearbyBloodBanks = (state) => state.bloodBank.nearbyBloodBanks

export const selectGroupBloodBanks = (state) => state.bloodBank.groupBloodBanks

export const selectBloodBankLoading = (state) => state.bloodBank.loading

export const selectBloodBankError = (state) => state.bloodBank.error

export const selectBloodBankSuccessMessage = (state) => state.bloodBank.successMessage

// Derived selectors

export const selectBloodBankCount = (state) => state.bloodBank.bloodBanks.length

export const selectIsBloodBankEmpty = (state) => state.bloodBank.bloodBanks.length === 0

export const selectBloodBankById = (state, id) => 
  state.bloodBank.bloodBanks.find((bank) => bank._id === id)

export const selectHasBloodBankError = (state) => state.bloodBank.error !== null

export const selectHasSuccessMessage = (state) => state.bloodBank.successMessage !== null

export const selectBloodBankInventory = (state) => 
  state.bloodBank.bloodBank?.bloodInventory || []

export const selectBloodGroupAvailability = (state, bloodGroup) => 
  state.bloodBank.bloodBank?.bloodInventory?.find(
    (inv) => inv.bloodGroup === bloodGroup
  )
