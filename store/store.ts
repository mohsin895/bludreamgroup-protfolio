import { configureStore, type Reducer } from "@reduxjs/toolkit"
import {
    persistStore, persistReducer,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
    type PersistConfig,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import cartReducer, { type CartState } from "./cartSlice"
import authReducer,     { type AuthState }     from "./authSlice"


const cartPersistConfig: PersistConfig<CartState> = {
    key:       "cart",
    storage,
    whitelist: ["items"],
}

const authPersistConfig: PersistConfig<AuthState> = {
    key:       "auth",
    storage,
    whitelist: ["token", "user"],
}

const persistedCart = persistReducer(cartPersistConfig, cartReducer) as unknown as Reducer<CartState>
const persistedAuth = persistReducer(authPersistConfig, authReducer) as unknown as Reducer<AuthState>

export const store = configureStore({
    reducer: {
        cart:     persistedCart,
        auth:     persistedAuth,


    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store)

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch