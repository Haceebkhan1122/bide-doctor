import storage from "redux-persist/lib/storage";
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import loginReducer from "../pages/login/redux/slice";
import layoutReducer from "../layouts/redux/slice";
import appointmentReducer from "../pages/appointments/redux/slice";

const reducers = combineReducers({
  login: loginReducer,
  layout: layoutReducer,
  appointment: appointmentReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware({
    // serializableCheck: {
    //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    // },
    serializableCheck: false
  }),
});

export let persisStore = persistStore(store);
