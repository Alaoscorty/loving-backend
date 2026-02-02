import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]; // [clientId, providerId]
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  // Blocage
  blockedBy?: mongoose.Types.ObjectId;
  blockedAt?: Date;
  // Statistiques
  unreadCount: Map<string, number>;

  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: Date,
    blockedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    blockedAt: Date,
    unreadCount: {
      type: Map,
      of: Number,
      default: () => new Map<string, number>(),
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

// S'assurer qu'il n'y a qu'une seule conversation entre deux utilisateurs
ConversationSchema.index({ participants: 1 }, { unique: true });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
