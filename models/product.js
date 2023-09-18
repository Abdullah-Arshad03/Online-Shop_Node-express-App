const mongodb = require('mongodb')
const getDb = require('../util/database').getDb;

class Product {
  constructor(title , price , imageUrl , description , id , userId ){
    this.title = title 
    this.price = price 
    this.imageUrl = imageUrl
    this.description = description
    this._id = id ? new mongodb.ObjectId(id) : null 
    this.userId = userId
  }

  save(){
    const db = getDb()
    let dbOp;
    if(this._id){
      dbOp = db.collection('Product').updateOne({_id : this._id} , {$set : this})
    }
    else{
      dbOp = db.collection('Product').insertOne(this)
    }
    return dbOp.then((result)=>{
     console.log('saved!!!!!',result)
     return result  
    }).catch((err)=>{
          console.log(err)
    })
  }

  static fetchAll ()
  {
  const db = getDb()
  return db.collection('Product').find().toArray().then((product)=>{
    console.log(product)
    return product
  }).catch((err)=>{
    console.log(err)
  })
  }

  static findById(prodId){
    const db = getDb()
    return db.collection('Product').find({_id : new mongodb.ObjectId(prodId)}).next().then((result)=>{
      console.log(result)
      return result
    }).catch((err)=>{
      console.log(err)
    })
  }

  static deleteById(prodId){
    const db = getDb()
    return db.collection('Product').deleteOne({_id: new mongodb.ObjectId(prodId)}).then((result)=>{
          console.log(result)
    }).catch((err)=>{
         console.log(err)
    })
  }
}

module.exports = Product
