import mongoose from 'mongoose';

mongoose.connect(String(process.env.MONGO), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(()=>console.log('Mongo connected'));
