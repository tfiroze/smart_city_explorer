let express = require('express')
let cors = require('cors')
let router = require('./router')

let app = express()

app.use(express.static(__dirname + '/temp_public'))
app.use(cors())
app.use('/api', router)

app.listen(80, () => {
    console.log('The server is on http://127.0.0.1')
})