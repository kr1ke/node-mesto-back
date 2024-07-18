import mongoose from 'mongoose';
import { isValidEmail, urlValidator } from "../errors/validation";

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  email: {
    type: String,
    required: [true, 'Поле email не может быть пустым'],
    unique: true,
    dropDups: true,
    validate: {
      validator: isValidEmail,
      message: 'Не валидный avatar',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле password не может быть пустым'],
    select: false,
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: urlValidator,
      message: 'Не валидный avatar',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default mongoose.model<IUser>('user', userSchema);
