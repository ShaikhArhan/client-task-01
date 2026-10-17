import { useEffect, useState } from 'react';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  createStudentThunk,
  deleteStudentThunk,
  fetchStudentsThunk,
  updateStudentThunk
} from '../redux/thunk/studentThunk';
import type { StudentFormValues, StudentRecord } from '../types';

const emptyForm: StudentFormValues = {
  fullName:       '',
  email:          '',
  phoneNumber:    '',
  dateOfBirth:    '',
  gender:         '',
  address:        '',
  courseEnrolled: '',
  password:       ''
};

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector((s) => s.student);

  // Fetch students when the page first mounts
  useEffect(() => {
    dispatch(fetchStudentsThunk());
  }, [dispatch]);

  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [formValues, setFormValues]             = useState<StudentFormValues>(emptyForm);

  const handleStudentSubmit = async (values: StudentFormValues) => {
    if (currentStudentId) {
      const result = await dispatch(updateStudentThunk({ id: currentStudentId, values }));
      if (updateStudentThunk.fulfilled.match(result)) {
        setCurrentStudentId(null);
        setFormValues(emptyForm);
      }
    } else {
      const result = await dispatch(createStudentThunk(values));
      if (createStudentThunk.fulfilled.match(result)) {
        setCurrentStudentId(null);
        setFormValues(emptyForm);
      }
    }
  };

  const handleEdit = (student: StudentRecord) => {
    setCurrentStudentId(student._id);
    setFormValues({
      fullName:       student.fullName,
      email:          student.email,
      phoneNumber:    student.phoneNumber,
      dateOfBirth:    student.dateOfBirth,
      gender:         student.gender,
      address:        student.address,
      courseEnrolled: student.courseEnrolled,
      password:       student.password
    });
  };

  const handleCancelEdit = () => {
    setCurrentStudentId(null);
    setFormValues(emptyForm);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteStudentThunk(id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 p-4 sm:p-6 lg:p-8">

      {/* Top bar */}
      <header className="max-w-[1400px] mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Student Portal</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage student registrations</p>
        </div>

        {/* Loading badge */}
        {loading && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </span>
        )}
      </header>

      {/* Error banner */}
      {error && (
        <div className="max-w-[1400px] mx-auto mb-4 flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-5 py-3.5 text-sm text-red-700 font-medium">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Main content */}
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 items-start">
        <StudentForm
          initialValues={formValues}
          onSubmit={handleStudentSubmit}
          isEdit={Boolean(currentStudentId)}
          onCancelEdit={handleCancelEdit}
          loading={loading}
        />
        <StudentList students={students} onEdit={handleEdit} onDelete={handleDelete} />
      </main>
    </div>
  );
};

export default DashboardPage;
