import mongoose, { Document, Model, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  price: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  videos: string[];
  affiliateLink: string;
  couponCode?: string;
  category: mongoose.Types.ObjectId;
  tags: string[];
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  clickCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    features: [
      {
        type: String,
        maxlength: [200, 'Feature cannot exceed 200 characters'],
      },
    ],
    pros: [
      {
        type: String,
        maxlength: [200, 'Pro cannot exceed 200 characters'],
      },
    ],
    cons: [
      {
        type: String,
        maxlength: [200, 'Con cannot exceed 200 characters'],
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be positive'],
      max: [100, 'Discount cannot exceed 100'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be between 0 and 5'],
      max: [5, 'Rating must be between 0 and 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
    affiliateLink: {
      type: String,
      required: [true, 'Affiliate link is required'],
    },
    couponCode: {
      type: String,
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    faqs: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug before saving
ProductSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Index for search
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;