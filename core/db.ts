import mongoose from 'mongoose';

mongoose.connect(String(process.env.MONGO || 'mongodb+srv://Dmytro:149600earthsun@cluster0-mwooj.mongodb.net/chat?retryWrites=true&w=majority'), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(()=>console.log('Mongo connected'));
