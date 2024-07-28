const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Express Vercel');
    }
);

app.use('/users', require('./Routes/Users.js'));


app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);


module.exports = app;