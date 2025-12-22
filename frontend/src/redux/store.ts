import authReducer from "@/redux/authSlice";
import predictReducer from "@/redux/predictionSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    authReducer: authReducer,
    predictionReducer: predictReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
