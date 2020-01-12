import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
import fs from 'fs'
import { createServer } from 'http';

dotenv.config();

import './core/db';
import createRoutes from './core/routes';
import createSocket from './core/socket';

const app = express();
const http = createServer(app);
const io = createSocket(http);

createRoutes(app, io);

const PORT = process.env.PORT || 3003;
if (process.env.NODE_ENV === 'production') {
  fs.readdirSync(path.join('client','build')).forEach(file => {
    console.log(file);
  });
  app.use(express.static('client/build'))

  app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'client','build','index.html'));
  })
}

http.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});
