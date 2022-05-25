const http=require('http');
const { Server }=require('socket.io');
const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')
const cors = require('cors')
const path =require('path');
const flash = require('connect-flash');
const session = require('express-session');
const multer = require('multer');
const MongoDbStore = require('connect-mongo');
// Config dotev
require('dotenv').config({
    path: './config/config.env'
})


const app = express()

// Connect to database
connectDB();

// body parser

app.use(cors({ origin: 3000 }));
app.use(express.static(path.join(__dirname, 'build')));
app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended:false}));
app.use(session({
    secret: 'mysecretsessionforthiswebsite',
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({mongoUrl: process.env.MONGO_URI}),
    cookie: { maxAge: 60 * 60 * 24 * 7 }
}));
app.use(flash());
// global variables
app.use((req, res, next) => {
    res.locals.messages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    res.locals.session = req.session;
    next();
});

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({ storage }).single('image'));



// Dev Logginf Middleware
if (process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}

// Use Routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/drawings', require('./routes/drawings'));
app.use('/api/images', require('./routes/images'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/upload', require('./routes/uploadRoute'));
app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const port = process.env.PORT || 5000

const httpServer = http.Server(app);
  const io = new Server(httpServer, { cors: { origin: '*' } });
  const users = [];
  
  io.on('connection', (socket) => {
    console.log('connection', socket.id);
    socket.on('disconnect', () => {
      const user = users.find((x) => x.socketId === socket.id);
      if (user) {
        user.online = false;
        console.log('Offline', user.name);
        const admin = users.find((x) => x.isAdmin && x.online);
        if (admin) {
          io.to(admin.socketId).emit('updateUser', user);
        }
      }
    });
    socket.on('onLogin', (user) => {
      const updatedUser = {
        ...user,
        online: true,
        socketId: socket.id,
        messages: [],
      };
      const existUser = users.find((x) => x._id === updatedUser._id);
      if (existUser) {
        existUser.socketId = socket.id;
        existUser.online = true;
      } else {
        users.push(updatedUser);
      }
      console.log('Online', user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', updatedUser);
      }
      if (updatedUser.isAdmin) {
        io.to(updatedUser.socketId).emit('listUsers', users);
      }
    });
  
    socket.on('onUserSelected', (user) => {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        const existUser = users.find((x) => x._id === user._id);
        io.to(admin.socketId).emit('selectUser', existUser);
      }
    });
  
    socket.on('onMessage', (message) => {
      if (message.isAdmin) {
        const user = users.find((x) => x._id === message._id && x.online);
        if (user) {
          io.to(user.socketId).emit('message', message);
          user.messages.push(message);
        }
      } else {
        const admin = users.find((x) => x.isAdmin && x.online);
        if (admin) {
          io.to(admin.socketId).emit('message', message);
          const user = users.find((x) => x._id === message._id && x.online);
          user.messages.push(message);
        } else {
          io.to(socket.id).emit('message', {
            name: 'Admin',
            body: 'Sorry. I am not online right now',
          });
        }
      }
    });
  });
  
  httpServer.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
  });
  
  // app.listen(port, () => {
  //   console.log(`Serve at http://localhost:${port}`);
  // });
  