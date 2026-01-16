import axiosInstance from "@/lib/axios";
import type { User, UserRegister } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      return res.data as User;
    } catch (err) {
      return rejectWithValue("Login failed");
    }
  }
);

const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user: UserRegister, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", user);
      return res.data as User;
    } catch (err) {
      return rejectWithValue("Registration failed");
    }
  }
);

const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data as User;
    } catch (err) {
      return rejectWithValue("Fetching user failed");
    }
  }
);

const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axiosInstance.get("/auth/logout");
  } catch (err) {
    console.log(err);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as User | null,
    error: null as string | null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        console.log("getCurrentUser fulfilled", action.payload);
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        console.log("getCurrentUser rejected", action.payload);
        state.user = null;
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export { getCurrentUser, loginUser, logout, registerUser };
export default authSlice.reducer;
