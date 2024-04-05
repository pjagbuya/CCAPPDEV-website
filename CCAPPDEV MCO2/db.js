const {MongoClient} = require('mongodb')

let dbConnection
const uri = 'mongodb+srv://paulagbuya:1234@animolabmongodb.7rja3ru.mongodb.net/?retryWrites=true&w=majority&appName=AnimoLabMONGODB'

module.exports = {
  connectToDb: (cb)=>{
      MongoClient.connect(uri)
      .then((client)=>{
      dbConnection = client.db()
      return cb()
    }).catch(err=>{
      console.log(err)
      return cb(err)
    })
  },
  getDb:()=>dbConnection
}
