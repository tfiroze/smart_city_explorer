let express = require('express')
let cors = require('cors')
let path = require('path')
let router = require('./router')
const session = require('express-session')
const cookieParser = require('cookie-parser')

let app = express()

app.use(express.static(path.join(__dirname, '../flask_react/frontend/build')))
// app.use(cors())

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cors(corsOptions));

app.use(cookieParser('Smart_City_Explorer'))
app.use(session({
  secret: 'Smart_City_Explorer',
  resave: false,
  saveUninitialized: false,
  secure: false, // Set this to true if using HTTPS
  // httpOnly: true
}));
app.use('/api', router)

// Adding new Hello World endpoint
app.get('/api/helloworld', (req, res) => {
  res.send('Hello, World!');
});

app.get('/clear-sessions', (req, res) => {
  console.log(req.session, 'ACTIVE SESSIONS');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error clearing sessions:', err);
      res.status(500).send('Error clearing sessions.');
    } else {
      console.log('SESSIONS CLEARED');
      res.send('All sessions have been cleared.');
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../flask_react/frontend/build', 'index.html'))
})

app.listen(5000, () => {
    console.log('The server is running on http://127.0.0.1:5000')
})
