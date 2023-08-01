let express = require('express')
let cors = require('cors')
let path = require('path')
let router = require('./router')
const session = require('express-session')

let app = express()

app.use(express.static(path.join(__dirname, '../flask_react/frontend/build')))
app.use(cors())
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));
app.use('/api', router)

// Adding new Hello World endpoint
app.get('/api/helloworld', (req, res) => {
  res.send('Hello, World!');
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../flask_react/frontend/build', 'index.html'))
})

app.listen(5000, () => {
    console.log('The server is running on http://127.0.0.1:5000')
})
