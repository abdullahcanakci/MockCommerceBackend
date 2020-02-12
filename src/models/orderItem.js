const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  price: { type: Number, required: true },
  amount: { type: Number, default: 1}
})

orderItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('OrderItem', orderItemSchema)