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
        const cartProductIndex = this.cart.items.findIndex((cp)=>{
             return cp.productId.toString() === product._id.toString()
        })
        let newQuantity = 1 
        const updatedCartItems = [...this.cart.items]

        if (cartProductIndex >= 0){
            newQuantity =  this.cart.items[cartProductIndex].quantity + 1 ;
            updatedCartItems[cartProductIndex].quantity = newQuantity; 

        }
        else{
            updatedCartItems.push({ productId : new mongodb.ObjectId(product._id), quantity : newQuantity})
        }

        
       const updatedCart = { items : updatedCartItems};

        const db = getDb();
        db.collection('User').updateOne(
            {_id : new mongodb.ObjectId(this._id)},
            {$set : {cart : updatedCart}}
        )
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
          return i.productId;
        });
        return db
          .collection('Product')
          .find({ _id: { $in: productIds } })
          .toArray()
          .then(products => {
            return products.map(p => {
              return {
                ...p,
                quantity: this.cart.items.find(i => {
                  return i.productId.toString() === p._id.toString();
                }).quantity,
              };
            });
          });
      }

      deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
          return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
          .collection('User')
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: updatedCartItems } } }
          );
      }
       addOrder(){
        const db = getDb()
        return db.collection('orders').insertOne(this.cart).then((result)=>{
          this.cart = {items : [] }
          return db.collection('User').updateOne({_id: new mongodb.ObjectId(this._id)}, { $set : {cart : { items : []}}})
        })
       }
    
    static findById(userId){
        const db = getDb()
        return db.collection('User').find({_id : new mongodb.ObjectId(userId)}).next()
    }
}

module.exports = User




























