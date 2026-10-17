import type { Request, Response } from 'express';
import Student from '../models/Student';
import { decryptValue, encryptValue } from '../utils/crypto';

const frontendSecret = process.env.FRONTEND_SECRET || 'student_frontend_secret';
const backendSecret = process.env.BACKEND_SECRET || 'student_backend_secret';

const decryptFrontendValue = (value: string) => decryptValue(value, frontendSecret);
const encryptBackendValue = (value: string) => encryptValue(value, backendSecret);
const decryptBackendValue = (value: string) => decryptValue(value, backendSecret);
const encryptFrontendValue = (value: string) => encryptValue(value, frontendSecret);

const normalizeStudentPayload = (payload: Record<string, any>) => ({
  fullName: String(payload.fullName || '').trim(),
  email: String(payload.email || '').trim(),
  phoneNumber: String(payload.phoneNumber || '').trim(),
  dateOfBirth: String(payload.dateOfBirth || '').trim(),
  gender: String(payload.gender || '').trim(),
  address: String(payload.address || '').trim(),
  courseEnrolled: String(payload.courseEnrolled || '').trim(),
  password: String(payload.password || '').trim()
});

const toPublicStudent = (student: any) => ({
  _id: student._id,
  fullName: encryptFrontendValue(decryptBackendValue(student.fullName)),
  email: encryptFrontendValue(decryptBackendValue(student.email)),
  phoneNumber: encryptFrontendValue(decryptBackendValue(student.phoneNumber)),
  dateOfBirth: encryptFrontendValue(decryptBackendValue(student.dateOfBirth)),
  gender: encryptFrontendValue(decryptBackendValue(student.gender)),
  address: encryptFrontendValue(decryptBackendValue(student.address)),
  courseEnrolled: encryptFrontendValue(decryptBackendValue(student.courseEnrolled)),
  password: encryptFrontendValue(decryptBackendValue(student.password))
});

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const data = normalizeStudentPayload(req.body);

    const decryptedPayload = {
      fullName: decryptFrontendValue(data.fullName),
      email: decryptFrontendValue(data.email),
      phoneNumber: decryptFrontendValue(data.phoneNumber),
      dateOfBirth: decryptFrontendValue(data.dateOfBirth),
      gender: decryptFrontendValue(data.gender),
      address: decryptFrontendValue(data.address),
      courseEnrolled: decryptFrontendValue(data.courseEnrolled),
      password: decryptFrontendValue(data.password)
    };

    if (!decryptedPayload.fullName || !decryptedPayload.email || !decryptedPayload.password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingStudent = await Student.findOne({
      email: encryptBackendValue(decryptedPayload.email)
    });

    if (existingStudent) {
      return res.status(409).json({ message: 'Student already exists' });
    }

    const newStudent = await Student.create({
      fullName: encryptBackendValue(decryptedPayload.fullName),
      email: encryptBackendValue(decryptedPayload.email),
      phoneNumber: encryptBackendValue(decryptedPayload.phoneNumber),
      dateOfBirth: encryptBackendValue(decryptedPayload.dateOfBirth),
      gender: encryptBackendValue(decryptedPayload.gender),
      address: encryptBackendValue(decryptedPayload.address),
      courseEnrolled: encryptBackendValue(decryptedPayload.courseEnrolled),
      password: encryptBackendValue(decryptedPayload.password)
    });

    return res.status(201).json({
      message: 'Student registered successfully',
      student: toPublicStudent(newStudent)
    });
  } catch (error) {
    console.error('registerStudent error', error);
    return res.status(500).json({ message: 'Unable to register student' });
  }
};

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.find({}).lean();
    const payload = students.map((student) => toPublicStudent(student));
    return res.status(200).json(payload);
  } catch (error) {
    console.error('getStudents error', error);
    return res.status(500).json({ message: 'Unable to load students' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = normalizeStudentPayload(req.body);

    const decryptedPayload = {
      fullName: decryptFrontendValue(data.fullName),
      email: decryptFrontendValue(data.email),
      phoneNumber: decryptFrontendValue(data.phoneNumber),
      dateOfBirth: decryptFrontendValue(data.dateOfBirth),
      gender: decryptFrontendValue(data.gender),
      address: decryptFrontendValue(data.address),
      courseEnrolled: decryptFrontendValue(data.courseEnrolled),
      password: decryptFrontendValue(data.password)
    };

    const updated = await Student.findByIdAndUpdate(
      id,
      {
        fullName: encryptBackendValue(decryptedPayload.fullName),
        email: encryptBackendValue(decryptedPayload.email),
        phoneNumber: encryptBackendValue(decryptedPayload.phoneNumber),
        dateOfBirth: encryptBackendValue(decryptedPayload.dateOfBirth),
        gender: encryptBackendValue(decryptedPayload.gender),
        address: encryptBackendValue(decryptedPayload.address),
        courseEnrolled: encryptBackendValue(decryptedPayload.courseEnrolled),
        password: encryptBackendValue(decryptedPayload.password)
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({
      message: 'Student updated successfully',
      student: toPublicStudent(updated)
    });
  } catch (error) {
    console.error('updateStudent error', error);
    return res.status(500).json({ message: 'Unable to update student' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('deleteStudent error', error);
    return res.status(500).json({ message: 'Unable to delete student' });
  }
};

export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const decryptedEmail = decryptFrontendValue(email);
    const decryptedPassword = decryptFrontendValue(password);

    const students = await Student.find({}).lean();
    const matchedStudent = students.find((student) => {
      const storedEmail = decryptBackendValue(student.email);
      const storedPassword = decryptBackendValue(student.password);
      return storedEmail === decryptedEmail && storedPassword === decryptedPassword;
    });

    if (!matchedStudent) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        email: encryptFrontendValue(decryptBackendValue(matchedStudent.email)),
        fullName: encryptFrontendValue(decryptBackendValue(matchedStudent.fullName))
      }
    });
  } catch (error) {
    console.error('loginStudent error', error);
    return res.status(500).json({ message: 'Unable to login' });
  }
};
