import mongoose from 'mongoose';

mongoose.connect(String(process.env.MONGO), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(()=>console.log('Mongo connected'));
