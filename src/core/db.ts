import mongoose from 'mongoose';

mongoose.connect(String(process.env.MONGODB_URI), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(()=>console.log('Mongo connected'));
