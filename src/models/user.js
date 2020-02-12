const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')
const AddressSchema = require('./address').schema
const BasketSchema = require('./basket').schema
const OrderSchema = require('./order').schema

const userSchema = mongoose.Schema({
  name: { type: String },
  surname: { type: String },
  passwordHash: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  addresses: { type: [AddressSchema] },
  basket: { type: [BasketSchema] },
  postponed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  orders: { type: [OrderSchema]}
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
    delete returnedObject.basket
    delete returnedObject.postponed
    delete returnedObject.orders
    delete returnedObject.addresses
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)