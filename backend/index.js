let express = require('express')
let cors = require('cors')
let path = require('path')
let router = require('./router')

let app = express()

app.use(express.static(path.join(__dirname, '../flask_react/frontend/build')))
app.use(cors())
app.use('/api', router)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../flask_react/frontend/build', 'index.html'))
})

app.listen(80, () => {
    console.log('The server is running on http://127.0.0.1')
})
