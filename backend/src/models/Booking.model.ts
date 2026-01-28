import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface IBooking extends Document {
  clientId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  // Détails de la réservation
  serviceType: string;
  serviceName: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // en heures
  location?: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  // Notes et préférences
  clientNotes?: string;
  providerNotes?: string;
  // Tarification
  basePrice: number;
  additionalFees?: number;
  commission: number; // Commission de la plateforme
  totalAmount: number;
  // Statuts
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  // Paiement
  paymentIntentId?: string; // Stripe Payment Intent ID
  paymentMethod?: string;
  paidAt?: Date;
  // Annulation
  cancelledBy?: 'client' | 'provider' | 'admin';
  cancelledAt?: Date;
  cancellationReason?: string;
  refundAmount?: number;
  // Révision
  reviewed: boolean;
  reviewId?: mongoose.Types.ObjectId;
  // Notifications
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'La durée minimum est 1 heure'],
    },
    location: {
      address: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    clientNotes: {
      type: String,
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
    },
    providerNotes: String,
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    additionalFees: {
      type: Number,
      default: 0,
      min: 0,
    },
    commission: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentIntentId: String,
    paymentMethod: String,
    paidAt: Date,
    cancelledBy: {
      type: String,
      enum: ['client', 'provider', 'admin'],
    },
    cancelledAt: Date,
    cancellationReason: String,
    refundAmount: {
      type: Number,
      min: 0,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
BookingSchema.index({ clientId: 1 });
BookingSchema.index({ providerId: 1 });
BookingSchema.index({ profileId: 1 });
BookingSchema.index({ date: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
