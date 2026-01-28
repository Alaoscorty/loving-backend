import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  role: 'provider';
  // Informations publiques
  displayName?: string;
  bio?: string;
  age?: number;
  location?: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  photos: string[]; // URLs Cloudinary
  // Services et tarifs
  services: Array<{
    type: string; // 'dinner', 'event', 'social', etc.
    name: string;
    description?: string;
    basePrice: number;
    duration: number; // en heures
  }>;
  // Disponibilité
  availability: {
    daysOfWeek: number[]; // 0-6 (dimanche-samedi)
    timeSlots: Array<{
      start: string; // HH:mm
      end: string; // HH:mm
    }>;
  };
  // Statut
  isVerified: boolean;
  isActive: boolean;
  isPremium: boolean;
  // Statistiques
  rating: number;
  reviewCount: number;
  bookingCount: number;
  // Validation admin
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  validatedAt?: Date;
  validatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['provider'],
      default: 'provider',
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [100, 'Le nom d\'affichage ne peut pas dépasser 100 caractères'],
    },
    bio: {
      type: String,
      maxlength: [1000, 'La bio ne peut pas dépasser 1000 caractères'],
    },
    age: {
      type: Number,
      min: [18, 'L\'âge minimum est 18 ans'],
      max: [100, 'L\'âge maximum est 100 ans'],
    },
    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    photos: [
      {
        type: String,
        required: true,
      },
    ],
    services: [
      {
        type: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: String,
        basePrice: {
          type: Number,
          required: true,
          min: [0, 'Le prix ne peut pas être négatif'],
        },
        duration: {
          type: Number,
          required: true,
          min: [1, 'La durée minimum est 1 heure'],
        },
      },
    ],
    availability: {
      daysOfWeek: [Number],
      timeSlots: [
        {
          start: { type: String, required: true },
          end: { type: String, required: true },
        },
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
    validatedAt: Date,
    validatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ status: 1 });
ProfileSchema.index({ isActive: 1 });
ProfileSchema.index({ rating: -1 });
ProfileSchema.index({ 'location.city': 1 });

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
