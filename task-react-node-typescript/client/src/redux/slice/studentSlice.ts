import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StudentRecord } from '../../types';
import {
  createStudentThunk,
  deleteStudentThunk,
  fetchStudentsThunk,
  loginStudentThunk,
  updateStudentThunk
} from '../thunk/studentThunk';

interface StudentState {
  students: StudentRecord[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
  isAuthenticated: false
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.students = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginStudentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStudentThunk.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch
      .addCase(fetchStudentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsThunk.fulfilled, (state, action: PayloadAction<StudentRecord[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createStudentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudentThunk.fulfilled, (state, action: PayloadAction<StudentRecord>) => {
        state.loading = false;
        state.students.unshift(action.payload);
      })
      .addCase(createStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateStudentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentThunk.fulfilled, (state, action: PayloadAction<StudentRecord>) => {
        state.loading = false;
        state.students = state.students.map((student) =>
          student._id === action.payload._id ? action.payload : student
        );
      })
      .addCase(updateStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteStudentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.students = state.students.filter((student) => student._id !== action.payload);
      })
      .addCase(deleteStudentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, clearError } = studentSlice.actions;
export default studentSlice.reducer;
