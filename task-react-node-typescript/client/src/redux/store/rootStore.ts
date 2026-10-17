import { combineReducers } from '@reduxjs/toolkit';
import studentReducer from '../slice/studentSlice';

// Add new feature reducers here — index.ts will pass this to configureStore
export const rootReducer = combineReducers({
  student: studentReducer
});

