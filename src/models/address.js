const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  title: {type: String, required: true},
  receiver: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  selected: {type: String, required:false, default: false}
})

addressSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Address = mongoose.model('Address', addressSchema)
module.exports = Address