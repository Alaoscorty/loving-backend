import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  // Évaluation
  rating: number; // 1-5
  comment?: string;
  // Catégories d'évaluation
  categories?: {
    punctuality?: number; // 1-5
    communication?: number; // 1-5
    professionalism?: number; // 1-5
    overall?: number; // 1-5
  };
  // Modération
  isVerified: boolean; // Vérifié que c'est un vrai client
  isVisible: boolean;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  // Réponse du prestataire
  providerResponse?: string;
  providerResponseAt?: Date;
  // Signalement
  reported: boolean;
  reportReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // Un seul avis par réservation
    },
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
    rating: {
      type: Number,
      required: true,
      min: [1, 'La note minimum est 1'],
      max: [5, 'La note maximum est 5'],
    },
    comment: {
      type: String,
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères'],
    },
    categories: {
      punctuality: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      professionalism: { type: Number, min: 1, max: 5 },
      overall: { type: Number, min: 1, max: 5 },
    },
    isVerified: {
      type: Boolean,
      default: true, // Vérifié si la réservation est complétée
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    moderatedAt: Date,
    providerResponse: {
      type: String,
      maxlength: [500, 'La réponse ne peut pas dépasser 500 caractères'],
    },
    providerResponseAt: Date,
    reported: {
      type: Boolean,
      default: false,
    },
    reportReason: String,
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
ReviewSchema.index({ bookingId: 1 });
ReviewSchema.index({ providerId: 1 });
ReviewSchema.index({ profileId: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ isVisible: 1 });
ReviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
