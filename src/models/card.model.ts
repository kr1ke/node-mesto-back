import mongoose from 'mongoose';

const urlValidator = (url:string) => {
  const urlRegex = /^(https?):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  const parts = url.split('.');

  if (parts.length > 1) {
    const topLevelDomain = parts.pop();
    return urlRegex.test(url) && (!!topLevelDomain && topLevelDomain.length > 1);
  }
  return false;
};

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле name не может быть пустыи'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'Поле link не может быть пустыи'],
    validate: {
      validator: urlValidator,
      message: 'Не валидная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default mongoose.model<any>('card', cardSchema);
