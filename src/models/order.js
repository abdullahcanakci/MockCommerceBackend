const mongoose = require("mongoose")
const OrderItemSchema = require('./orderItem').schema

const orderSchema = mongoose.Schema({
  total: { type: String, required: true },
  date: { type: Date, default: Date.now },
  addressBilling: { type: mongoose.Schema.Types.ObjectId },
  addressShipping: { type: mongoose.Schema.Types.ObjectId },
  items: {type: [OrderItemSchema], ref: "OrderItem" }
})

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Order', orderSchema)