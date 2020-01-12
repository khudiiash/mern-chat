import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
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

  app.use(express.static(path.join(__dirname, "client", "build")))

  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'client','build','index.html'));
  })
  
}

http.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});
