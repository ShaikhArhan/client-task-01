import { useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { createStudentThunk } from '../redux/thunk/studentThunk';
import type { StudentFormValues } from '../types';

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

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.student);

  const handleRegister = async (values: StudentFormValues) => {
    const result = await dispatch(createStudentThunk(values));
    if (createStudentThunk.fulfilled.match(result)) {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Portal</h1>
          <p className="text-slate-400 mt-1 text-sm">Create your student account</p>
        </div>

        {/* Server error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-red-500/20 border border-red-400/30 px-5 py-3.5 text-sm text-red-300 font-medium backdrop-blur-sm">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Form card */}
        <StudentForm
          initialValues={emptyForm}
          onSubmit={handleRegister}
          isEdit={false}
          loading={loading}
        />

        {/* Back to login */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            Sign in
          </button>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
