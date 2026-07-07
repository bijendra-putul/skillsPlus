import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  product: mongoose.Types.ObjectId;
  clicks: number;
  date: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

const AnalyticsSchema: Schema<IAnalytics> = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    clicks: {
      type: Number,
      default: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
AnalyticsSchema.index({ product: 1, date: -1 });
AnalyticsSchema.index({ date: 1 });

const Analytics: Model<IAnalytics> = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
export default Analytics;