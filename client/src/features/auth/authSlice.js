// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  registerCustomerApi,
  getProfileApi,
} from "../../api/auth/auth";

// Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginApi(credentials);
      // backend: { message, statusCode, dataResponse: { token } }
      const token = res.data?.dataResponse?.token;
      if (!token) throw new Error("No token returned from backend");

      if (token) {
        localStorage.setItem("accessToken", token);
      }

      return { token };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

export const registerCustomer = createAsyncThunk(
  "auth/registerCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await registerCustomerApi(payload);
      // backend: { dataResponse: { user, token } }
      const user = res.data?.dataResponse?.user;
      const token = res.data?.dataResponse?.token || res.data?.token;

      if (token) {
        localStorage.setItem("accessToken", token);
      }

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfileApi();
      // backend: { dataResponse: { user } }
      const user = res.data?.dataResponse?.user || res.data?.user;
      return { user };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch profile");
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("accessToken") || null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
    },
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("accessToken", action.payload);
      } else {
        localStorage.removeItem("accessToken");
      }
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });

    // register
    builder
      .addCase(registerCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user || null;
        state.token = action.payload.token || state.token;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      });

    // fetchProfile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch profile";
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
