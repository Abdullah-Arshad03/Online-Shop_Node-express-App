const mongoose = require('mongoose')


const Schema = mongoose.Schema

const productSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String ,
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId ,
        ref : "User"
    }

})

module.exports = mongoose.model('Product', productSchema)



































// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title , price , imageUrl , description , id , userId){
//     this.title = title 
//     this.price = price 
//     this.imageUrl = imageUrl
//     this.description = description
//     this._id = id ? new mongodb.ObjectId(id) : null
//     this.userId = userId
//   }

//   save(){
//            const db = getDb()
//            let dbOp 
//            if(this._id)
//            {
//             //now we will update product
//               dbOp =  db.collection('Product').updateOne({ _id : this._id} , {$set : this})
//            }
//            else
//            {
//                 dbOp = db.collection('Product').insertOne(this).then((product)=>{
//                 console.log("This is the Saved Product", product)
//                 return product
//                }).catch((err)=>{
//                 console.log(err)
//                })
//            }
//           return dbOp.then((result)=>{
//             console.log('this is the db collection in the db',result)
//             return result
            
//           }).catch((err)=>{
//               console.log(err)})
//   }
//   static fetchAll ()
//   {
//   const db = getDb()
//   return db.collection('Product').find().toArray().then((product)=>{
//     console.log(product)
//     return product
//   }).catch((err)=>{
//     console.log(err)
//   })
//   }
  
//   static findById(prodId){
//     const db = getDb()
//     return db.collection('Product').find({_id : new mongodb.ObjectId(prodId)}).next().then((result)=>{
//       console.log(result)
//       return result
//     }).catch((err)=>{
//       console.log(err)
//     })
//   }

//   static deleteById(prodId){

//     const db = getDb()
//     return db.collection('Product').deleteOne({ _id : new mongodb.ObjectId(prodId) }).then((result)=>{
//       console.log(result)
//     }).catch((err)=>{
//       console.log(err)
//     })
//     // const db = getDb()
//     // return db.collection('Product').deleteOne({_id: new mongodb.ObjectId(prodId)}).then((result)=>{
//     //       console.log(result)
//     // }).catch((err)=>{
//     //      console.log(err)
//     // })
//   }
// }

// module.exports = Product
