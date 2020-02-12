const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  items: { type: Number, default: 0 },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.products
    delete returnedObject.items
  }
})

module.exports = mongoose.model('Category', categorySchema)
