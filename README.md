# ORDINARY CHAT

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://ordinary-chat.herokuapp.com/)

Ordinary Chat is a web-based MERN stack chat application

  - Sends emails on each new message when the receiver is offline.
  - Has registration/authentication (JWT)
  - Can send photos and audio recordings
  - Resonsive design

# Cool Features!

  - Shows when the user was online last time
  - Shows whether the user read your last messages
# How It Looks?
![Screenshot](https://res.cloudinary.com/dwslf2mo2/image/upload/v1579263215/chat_screenshot_j98x6b.png)


### Tech

The Ordinary Chat uses a number of open source projects to work properly:

* [ReactJS] - HTML enhanced for web apps!
* [Ant Design] - Excellent library of ready-to-use components and icons
* [NodeJS] - evented I/O for the backend
* [Socket IO] - Best for working with messaging
* [Express] - fast node.js network app framework
* [JWT] - authorization framework
* [Mongo DB] - comfortable, fast, and mondern database
* [Cloudinary] - for storing media content
* [Heroku] - free and comfortable hosting for test projects.


And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

### Installation
First, you will need to create your own **.env** file in the root folder.

It must inclue the following variables:
>NODE_ENV
PORT
JWT_SECRET
JWT_MAX_AGE
MONGODB_URI
NODEMAILER_HOST
NODEMAILER_PORT
NODEMAILER_USER
NODEMAILER_PASS
CLOUDINARY_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

All APIs used for this project are open-source, so keys are free.

If you would like to run the code, you will need to install modules for both server and client:
```sh
$ npm install
$ cd src/client
$ npm install
```
After than, run both the client and the server:
```sh
$ npm start
$ cd ..
$ cd ..
$ npm start
```
For production environments, initailize the git, craete heroku app (you must have an account for this), and push it in production.
In the root folder:
```
$ git init
$ git add .
$ git commit -m 'init'
$ heroku create chat-app
$ heroku addons:create mongolab:sandbox
$ git push heroku master
```

   [Socket IO]: <https://socket.io/>
   [Cloudinary]: <https://cloudinary.com/>
   [JWT]: <https://jwt.io/>
   [Ant Design]: <https://ant.design/>
   [NodeJS]: <http://nodejs.org>
   [Express]: <http://expressjs.com>
   [ReactJS]: <https://reactjs.org/>
   [Mongo DB]: <https://www.mongodb.com/>
   [Webpack]: <https://webpack.js.org/>
   [Heroku]: <https://www.heroku.com/>
   

