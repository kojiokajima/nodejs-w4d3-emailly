const mongoose = require('mongoose')
const { Schema } = mongoose

const recipientSchema = new Schema({
  email: String,
  hasResponded: {
    type: Boolean,
    default: false
  }
})

// module.exports = mongoose.model('Recipient', recipientSchema)
