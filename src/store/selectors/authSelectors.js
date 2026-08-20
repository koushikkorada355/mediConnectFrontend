// Auth Selectors

export const selectAuth = (state) => state.auth;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export const selectAuthToken = (state) => state.auth.token;

export const selectAuthRole = (state) => state.auth.role;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;
