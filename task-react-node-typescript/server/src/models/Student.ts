import { model, Schema, type InferSchemaType } from 'mongoose';

const studentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    courseEnrolled: { type: String, required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export type StudentDocument = InferSchemaType<typeof studentSchema>;

const Student = model<StudentDocument>('Student', studentSchema);

export default Student;
