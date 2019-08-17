const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
/* 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(port);