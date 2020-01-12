import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
import fs from 'fs'
import { createServer } from 'http';
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

dotenv.config();

import './core/db';
import createRoutes from './core/routes';
import createSocket from './core/socket';

const app = express();
const http = createServer(app);
const io = createSocket(http);

createRoutes(app, io);

const jwtMW = exjwt({
  secret: process.env.JWT_SECRET
});


const PORT = process.env.PORT || 3003;
if (process.env.NODE_ENV === 'production') {
  console.log(process.env)
  app.use(express.static(path.join(__dirname, "client", "build")))

  app.get('*', jwtMW, (req,res) => {
    res.sendFile(path.join(__dirname,'client','build','index.html'));
  })
}

http.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});
