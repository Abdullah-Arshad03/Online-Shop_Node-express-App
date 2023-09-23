const mongodb = require ('mongodb')
const getDb = require('../util/database').getDb



class User {
    constructor(username , email , cart , id){
        this.username = username ,
        this.email = email 
        this.cart = cart // cart : {item : []}
        this._id = id
    }

    save(){
        const db = getDb()
        return db.collection('User').insertOne(this)
    }

    addToCart(product){
        const db = getDb()
        // const cartProduct = this.cart.items.findIndex((cp)=>{
        //     return cp._id === product._id
        // })

        const updatedCart = { items : [{...product , quantity: 1}]}
        return db.collection('User').updateOne({_id : new mongodb.ObjectId(this._id)} , {$set : {cart : updatedCart}})


    }

    static findById(userId){
        const db = getDb()
        return db.collection('User').find({_id : new mongodb.ObjectId(userId)}).next()
    }
}

module.exports = User































// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb


// class User {
//     constructor(user , email , cart , id)
//     {
//         this.user = user
//         this.email = email
//         this.cart = cart // lets see that cart will be look like this cart =  {items : }
//         this._id = id

//     }

//      save()
//      {
//         const db = getDb()
//         return db.collection('User').insertOne(this).then((result)=>{
//             console.log(result)
//             return result;
//         }).catch((err)=>{
//             console.log(err)
//         })
//      }

//      addToCart(product){

//     // const cartProduct = this.cart.items.findIndex((cp)=>{
//     //     return cp._id = product._id
//     // })
//     // yeh jo uper wala func hy yeh mujy bataye ga k kiya jo mai product add karna chah raha houn kiya wo cart mai already exist karti hy, agr is ny index dediya other than -1 tou iska matlab hoga k is mai waqai hi wo exist karti hy. tou phir mai us hisaab sy dekoun ga k kiya kiya mujy is mai ab mazeed quantity add karni hy kiun k mujy pata lag jaya ga .

// // now lets start from the scratch that without even checking that k product exist karti hy ni 


// // there we will add all the logic that either product is inside the cart or there either i just want to increase the quantity or if it is not there and i have to add the product




//         const updatedCart =  {items : [{...product , quantity : 1}]}
//         const db = getDb()
//         db.collection('Users').updateOne({ _id : new mongodb.ObjectId(this._id)} , {$set : {cart : updatedCart}})
//      }

//      static findUser(userId){
//         const db = getDb()
//         return db.collection('User').findOne({_id : new mongodb.ObjectId(userId)}).then((result)=>{
//             console.log(result)
//             return result
//         }).catch((err)=>{

//                 console.log(err)
//         })
//      }
// }

// module.exports = User