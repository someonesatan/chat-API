const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

class DataBase {

  constructor() {
    this.url = 'mongodb://localhost:27017/chat';
    this.messagesCount = 100;
    return this
  }

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.url, (err, db) => {
        if (err) reject(err)
        let dataBase = db
        resolve(dataBase)
      })
    })
  }

  getMessages(dataBase, data, resolve) {
    let lastMessageId = data.query.id;
    if (lastMessageId) {

      dataBase.collection('messages').find({ '_id': { $gt: ObjectID(lastMessageId) } }).toArray((err, messages) => {
        console.log(messages)
        resolve(messages)
      })
    } else {
      dataBase.collection('messages').find().toArray((err, messages) => {
        resolve(messages)
      })
    }
  }

  addMessage(dataBase, data, resolve) {
    let message = data.body.value;
    let result = dataBase.collection('messages').insert({'msg': message}, {}, function(){
      dataBase.collection('messages').find().toArray((err, messages) => {
        if (err) console.log(err)
        if (messages.length > 99) {
          dataBase.collection('messages').remove({ _id: ObjectID(messages[0]._id) });
        }
        resolve()
      })
    });


  }

  makeDbRequest(method, data) {
    let responseData = null;
    let db = null;
    return this.connect()
    .then(dataBase => {
      return new Promise((resolve, reject) => {
        db = dataBase;
        if (method === 'GET') {
          responseData = this.getMessages(db, data, resolve);
        } else if (method === 'POST') {
          this.addMessage(db, data, resolve);
        }
      });
    })
    .then( (messages) => {
      responseData = messages;
      db.close()
      return responseData;
    })
  }
}

module.exports = DataBase;
