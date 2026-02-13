import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected' | 'booking_cancelled' | 'payment_received' | 'review_received' | 'profile_approved' | 'profile_rejected' | 'admin_message' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  relatedBooking?: mongoose.Types.ObjectId;
  relatedProfile?: mongoose.Types.ObjectId;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['booking_request', 'booking_accepted', 'booking_rejected', 'booking_cancelled', 'payment_received', 'review_received', 'profile_approved', 'profile_rejected', 'admin_message', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Le message ne peut pas dépasser 1000 caractères'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedBooking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    relatedProfile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
