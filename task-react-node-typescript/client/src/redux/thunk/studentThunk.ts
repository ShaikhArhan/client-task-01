import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createStudentService,
  deleteStudentService,
  fetchStudentsService,
  loginStudentService,
  updateStudentService
} from '../service/studentService';
import type { LoginFormValues, StudentFormValues } from '../../types';

export const loginStudentThunk = createAsyncThunk(
  'student/login',
  async (payload: LoginFormValues, { rejectWithValue }) => {
    try {
      return await loginStudentService(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchStudentsThunk = createAsyncThunk(
  'student/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchStudentsService();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Unable to fetch students');
    }
  }
);

export const createStudentThunk = createAsyncThunk(
  'student/createStudent',
  async (payload: StudentFormValues, { rejectWithValue }) => {
    try {
      return await createStudentService(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Unable to create student');
    }
  }
);

export const updateStudentThunk = createAsyncThunk(
  'student/updateStudent',
  async ({ id, values }: { id: string; values: StudentFormValues }, { rejectWithValue }) => {
    try {
      return await updateStudentService(id, values);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Unable to update student');
    }
  }
);

export const deleteStudentThunk = createAsyncThunk(
  'student/deleteStudent',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteStudentService(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Unable to delete student');
    }
  }
);
