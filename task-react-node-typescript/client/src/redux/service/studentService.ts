import { appAxios } from '../../utils/axios';
import { decryptValue, encryptValue } from '../../utils/crypto';
import type { LoginFormValues, StudentFormValues, StudentRecord } from '../../types';

// ---------------------------------------------------------------------------
// Helpers — encrypt / decrypt all student fields
// ---------------------------------------------------------------------------

const encryptStudent = (student: StudentFormValues) => ({
  fullName: encryptValue(student.fullName),
  email: encryptValue(student.email),
  phoneNumber: encryptValue(student.phoneNumber),
  dateOfBirth: encryptValue(student.dateOfBirth),
  gender: encryptValue(student.gender),
  address: encryptValue(student.address),
  courseEnrolled: encryptValue(student.courseEnrolled),
  password: encryptValue(student.password)
});

const decryptStudent = (student: StudentRecord): StudentRecord => ({
  ...student,
  fullName: decryptValue(student.fullName),
  email: decryptValue(student.email),
  phoneNumber: decryptValue(student.phoneNumber),
  dateOfBirth: decryptValue(student.dateOfBirth),
  gender: decryptValue(student.gender),
  address: decryptValue(student.address),
  courseEnrolled: decryptValue(student.courseEnrolled),
  password: decryptValue(student.password)
});

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export const loginStudentService = async (payload: LoginFormValues) => {
  const response = await appAxios.post('/login', {
    body: {
      email: encryptValue(payload.email),
      password: encryptValue(payload.password)
    }
  });
  return response.data;
};

export const fetchStudentsService = async (): Promise<StudentRecord[]> => {
  const response = await appAxios.get('/students');
  const list = Array.isArray(response.data) ? response.data : [];
  return list.map((student) => decryptStudent(student as StudentRecord));
};

export const createStudentService = async (
  payload: StudentFormValues
): Promise<StudentRecord> => {
  const response = await appAxios.post<{ student: StudentRecord }>('/register', {
    body: encryptStudent(payload)
  });
  return decryptStudent(response.data.student as StudentRecord);
};

export const updateStudentService = async (
  id: string,
  values: StudentFormValues
): Promise<StudentRecord> => {
  const response = await appAxios.put<{ student: StudentRecord }>('/student/:id', {
    params: { id },
    body: encryptStudent(values)
  });
  return decryptStudent(response.data.student as StudentRecord);
};

export const deleteStudentService = async (id: string): Promise<string> => {
  await appAxios.delete('/student/:id', {
    params: { id }
  });
  return id;
};

