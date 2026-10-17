import { ErrorMessage, Field, Form, Formik } from 'formik';
import { z } from 'zod';
import type { StudentFormValues } from '../types';

const studentSchema = z.object({
  fullName:       z.string().trim().min(2, 'Full name is required'),
  email:          z.string().trim().email('Enter a valid email address'),
  phoneNumber:    z.string().trim().min(10, 'Phone must be at least 10 digits'),
  dateOfBirth:    z.string().min(1, 'Date of birth is required'),
  gender:         z.string().min(1, 'Gender is required'),
  address:        z.string().trim().min(5, 'Address is required'),
  courseEnrolled: z.string().trim().min(2, 'Course is required'),
  password:       z.string().min(6, 'Password must be at least 6 characters')
});

const getValidationErrors = (values: StudentFormValues) => {
  const result = studentSchema.safeParse(values);
  if (result.success) return {};
  return result.error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path[0]?.toString() || 'form';
    acc[key] = issue.message;
    return acc;
  }, {});
};

interface StudentFormProps {
  initialValues: StudentFormValues;
  onSubmit: (values: StudentFormValues) => void;
  isEdit: boolean;
  onCancelEdit?: () => void;
  loading?: boolean;
}

// Reusable field wrapper
const FieldGroup = ({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  as,
  children
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  as?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </label>
    {as === 'select' ? (
      <Field
        as="select"
        id={id}
        name={name}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
      >
        {children}
      </Field>
    ) : as === 'textarea' ? (
      <Field
        as="textarea"
        id={id}
        name={name}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
      />
    ) : (
      <Field
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
      />
    )}
    <ErrorMessage name={name} component="span" className="text-xs text-red-500" />
  </div>
);

import React from 'react';

const StudentForm = ({
  initialValues,
  onSubmit,
  isEdit,
  onCancelEdit,
  loading
}: StudentFormProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl shadow ${isEdit ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isEdit
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            }
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? 'Update Student' : 'Register Student'}
          </h2>
          <p className="text-xs text-slate-400">
            {isEdit ? 'Edit the student details below' : 'Fill in the form to add a new student'}
          </p>
        </div>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={getValidationErrors}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
      >
        {() => (
          <Form className="flex flex-col gap-4">

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup id="fullName" name="fullName" label="Full Name" placeholder="John Doe" />
              <FieldGroup id="email" name="email" label="Email" type="email" placeholder="john@example.com" />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup id="phoneNumber" name="phoneNumber" label="Phone Number" placeholder="+91 98765 43210" />
              <FieldGroup id="dateOfBirth" name="dateOfBirth" label="Date of Birth" type="date" />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup id="gender" name="gender" label="Gender" as="select">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </FieldGroup>
              <FieldGroup id="courseEnrolled" name="courseEnrolled" label="Course Enrolled" placeholder="e.g. B.Tech CSE" />
            </div>

            {/* Address */}
            <FieldGroup id="address" name="address" label="Address" as="textarea" placeholder="Full address…" />

            {/* Password */}
            <FieldGroup id="password" name="password" label="Password" type="password" placeholder="••••••••" />

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isEdit
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-orange-300/40 hover:shadow-orange-400/50'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 shadow-blue-500/30 hover:shadow-blue-500/40'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving…
                  </span>
                ) : isEdit ? 'Update Student' : 'Register Student'}
              </button>

              {isEdit && onCancelEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 active:bg-slate-300"
                >
                  Cancel
                </button>
              )}
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StudentForm;
