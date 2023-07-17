let express = require('express');
let cors = require('cors');
let router = require('./router');

let app = express();

app.use(cors());
app.use('/api', router);

app.listen(5000, () => {   // Make sure to choose the correct port here
    console.log('The server is running on http://localhost:5000');
});
