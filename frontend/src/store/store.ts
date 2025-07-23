import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

const rootReducer = combineReducers({
  auth: authReducer, // your persisted slice
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist the auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // Redux Toolkit includes a default middleware that check state and action which are all serializable 
  // But redux-persist uses some non-serializable values (like special action types and metadata), 
  // which trigger this warning/error: A non-serializable value was detected in an action
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;