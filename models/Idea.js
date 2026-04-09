import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the startup idea.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the startup idea.'],
  },
  analysis: {
    problem: String,
    customer: String,
    market: String,
    competitor: [
      {
        name: String,
        difference: String,
      },
    ],
    tech_stack: [String],
    risk_level: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
    },
    profitability_score: Number,
    justification: String,
  },
  pitchDeck: {
    slides: [
      {
        slide_number: Number,
        title: String,
        content: String,
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Idea || mongoose.model('Idea', IdeaSchema);
