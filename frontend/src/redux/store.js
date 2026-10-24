import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * MODULE 5: State Management, API Handling & Deployment
 * Redux Toolkit Setup: Slices, Actions, Reducers, and Async Thunks
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Async Thunk for fetching pets from API
export const fetchPets = createAsyncThunk('pets/fetchPets', async ({ category = 'All', search = '' } = {}, { rejectWithValue }) => {
  try {
    let url = `${API_BASE_URL}/pets?`;
    if (category && category !== 'All') url += `category=${encodeURIComponent(category)}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Pets Slice
const petsSlice = createSlice({
  name: 'pets',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedCategory: 'All',
    searchQuery: '',
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch pets';
      });
  },
});

export const { setCategory, setSearchQuery, clearError } = petsSlice.actions;

export const store = configureStore({
  reducer: {
    pets: petsSlice.reducer,
  },
});
