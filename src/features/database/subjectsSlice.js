import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import client from '../../app/database';

import { SUBJECTS } from '../../graphql/subjects';

export const fetchSubjects = createAsyncThunk('subjects/fetchSubjects', async () => {
  try {
    const subjects = await client.request(SUBJECTS);
    return subjects.subjects;
  } catch (err) {
    throw new Error(err?.response?.errors[0]?.message);
  }
});

const initialState = {
  error: '',
  loading: false,
  subjects: [],
};

const slice = createSlice({
  name: 'subjects',

  initialState: initialState,

  reducers: {
    reset: () => initialState,
  },

  extraReducers: (builder) => {
    const pending = (state) => ({ ...state, loading: true });
    const fulfilled = (state, action) => ({ ...state, subjects: action.payload, loading: false });
    const rejected = (state, action) => ({ ...state, error: action.error, loading: false });

    builder.addCase(fetchSubjects.pending, pending).addCase(fetchSubjects.fulfilled, fulfilled).addCase(fetchSubjects.rejected, rejected);
  },
});

export const { reset } = slice.actions;

export const selectSubjects = (state) => state.database.subjects.subjects;

export const isLoading = (state) => state.database.subjects.loading;

export default slice.reducer;
