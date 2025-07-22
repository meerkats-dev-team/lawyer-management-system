import { Schema, model, Document, Types } from 'mongoose';
import { ICase } from './Case.schema';

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface IAppointment extends Document {
  time: Date;
  location: string;
  notes?: string;
  status: AppointmentStatus;
  caseId: Types.ObjectId | ICase;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    time: {
      type: Date,
      required: [true, 'Appointment time is required'],
    },
    location: {
      type: String,
      required: [true, 'Appointment location is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED,
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt
  },
);

const Appointment = model<IAppointment>('Appointment', appointmentSchema);
export default Appointment;