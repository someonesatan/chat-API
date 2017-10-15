const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer();
const app = express();

const DataBase = require('./dataBase.js');
const db = new DataBase();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routing
app.get('/getLastMessages', function (req, res) {
  console.log('Get request received');
  db.makeDbRequest('GET', req)
  .then(messages => {
    res.send(messages);
  })
})

app.post('/addNewMessage', upload.array(), function (req, res, next) {
  console.log('Post request received');
  db.makeDbRequest('POST', req);
  res.end()
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
