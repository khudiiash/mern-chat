import mongoose, { Schema, Document } from 'mongoose';
import { isEmail } from 'validator';
import { generatePasswordHash } from '../utils';
import differenceInMinutes from 'date-fns/difference_in_minutes';

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  confirmed: boolean;
  avatar: string;
  confirm_hash?: string;
  last_seen?: Date;
  isOnline?:boolean;
  current_dialog_id?:string;
  receiver_id?:string;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      require: 'Email address is required',
      validate: [isEmail, 'Invalid email'],
      unique: true,
    },
    fullName: {
      type: String,
      required: 'Name is required',
    },
    password: {
      type: String,
      required: 'Password is required',
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    avatar: String,
    confirm_hash: String,
    last_seen: {
      type: Date,
      default: new Date(),
    },
    current_dialog_id: String,
    receiver_id:String,
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual('isOnline').get(function(this: any) {
  return differenceInMinutes(new Date().toISOString(), this.last_seen) < 1;
});

UserSchema.set('toJSON', {
  virtuals: true,
});
UserSchema.set('toObject', {
  getters: true,
});

UserSchema.pre('save', async function(next) {
  const user: any = this;

  if (!user.isModified('password')) {
    return next();
  }

  user.password = await generatePasswordHash(user.password);
  user.confirm_hash = await generatePasswordHash(new Date().toString());
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
