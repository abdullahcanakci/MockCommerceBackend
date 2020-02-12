const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, required: false, default: null},
  images: [{ type: String }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Product', productSchema)