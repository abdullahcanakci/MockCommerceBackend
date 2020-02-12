const mongoose = require("mongoose");

const basketSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  amount: { type: Number, default: 1}
})

basketSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Basket = mongoose.model('Basket', basketSchema)
module.exports = Basket