export interface StudentFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

export interface StudentRecord extends StudentFormValues {
  _id: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}
