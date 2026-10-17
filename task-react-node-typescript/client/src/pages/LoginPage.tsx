import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchStudentsThunk, loginStudentThunk } from '../redux/thunk/studentThunk';
import type { LoginFormValues } from '../types';

const LoginPage = () => {
  const dispatch    = useAppDispatch();
  const navigate    = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.student);

  // If already authenticated redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values: LoginFormValues) => {
    const result = await dispatch(loginStudentThunk(values));
    if (loginStudentThunk.fulfilled.match(result)) {
      dispatch(fetchStudentsThunk());
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Portal</h1>
          <p className="text-slate-400 mt-1 text-sm">Secure student registration system</p>
        </div>

        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

        {/* Link to Register */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
