import axiosInstance from "@/lib/axios";
import type { Prediction, PredictionRequest } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const predict = createAsyncThunk(
  "prediction/predict",
  async (requestData: PredictionRequest, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/predict", requestData);
      return res.data as Prediction;
    } catch (err) {
      return rejectWithValue("Prediction failed");
    }
  }
);

const predictionSlice = createSlice({
  name: "prediction",
  initialState: {
    predication: null as Prediction | null,
    error: null as string | null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(predict.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(predict.fulfilled, (state, action) => {
        state.loading = false;
        state.predication = action.payload;
      })
      .addCase(predict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export { predict };
export default predictionSlice.reducer;
