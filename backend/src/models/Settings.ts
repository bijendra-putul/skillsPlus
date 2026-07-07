import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema<ISettings> = new Schema(
  {
    siteName: {
      type: String,
      default: 'NearSkill',
    },
    siteDescription: {
      type: String,
      default: 'Discover useful products, tools, and services',
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
    contactInfo: {
      email: {
        type: String,
        default: 'contact@nearskill.com',
      },
      phone: String,
      address: String,
    },
    seo: {
      defaultTitle: {
        type: String,
        default: 'NearSkill - Product Discovery Platform',
      },
      defaultDescription: {
        type: String,
        default: 'Discover useful products, tools, software, courses, and AI tools with honest reviews and comparisons.',
      },
      googleAnalyticsId: String,
      googleSiteVerification: String,
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> = mongoose.model<ISettings>('Settings', SettingsSchema);
export default Settings;