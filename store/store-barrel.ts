import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

// ─── Shape ────────────────────────────────────────────────────────────────────

export interface AuthUser {
    id:     number;
    name:   string;
    email:  string;
    avatar: string | null;
    role?:  string;
}

export interface AuthState {
    token:       string | null;
    user:        AuthUser | null;
    initialized: boolean;   // true once /auth/me has been attempted
    loading:     boolean;   // in-flight request flag
    error:       string | null;
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token:       null,
        user:        null,
        initialized: false,
        loading:     false,
        error:       null,
    } as AuthState,
    reducers: {

        /** After a successful login — stores token + user together */
        setCredentials(
            state,
            action: PayloadAction<{ token: string; user: AuthUser }>
        ) {
            state.token = action.payload.token;
            state.user  = action.payload.user;
            state.error = null;
        },

        /** Called by AuthProvider / useAuth after /auth/me resolves successfully */
        setUser(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload;
        },

        /** Called by AuthProvider once the /auth/me attempt is complete */
        setInitialized(state) {
            state.initialized = true;
        },

        /** Toggle the loading spinner — used by useAuth actions */
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        /** Store an auth error message (e.g. "Invalid email or password") */
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        /** Update individual user fields (e.g. after profile edit) */
        updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
            if (state.user) Object.assign(state.user, action.payload);
        },

        /** Clear everything on logout or invalid token */
        logout(state) {
            state.token       = null;
            state.user        = null;
            state.error       = null;
            state.loading     = false;
            state.initialized = true; // keep true so AuthProvider doesn't re-run
        },
    },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
    setCredentials,
    setUser,
    setInitialized,
    setLoading,
    setError,
    updateUser,
    logout,
} = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectIsAuth       = (s: RootState): boolean         => !!s.auth.token;
export const selectUser         = (s: RootState): AuthUser | null => s.auth.user;
export const selectToken        = (s: RootState): string | null   => s.auth.token;
export const selectInitialized  = (s: RootState): boolean         => s.auth.initialized;
export const selectAuthLoading  = (s: RootState): boolean         => s.auth.loading;
export const selectAuthError    = (s: RootState): string | null   => s.auth.error;

export default authSlice.reducer;