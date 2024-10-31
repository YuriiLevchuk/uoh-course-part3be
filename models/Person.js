const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to url: ', url)

mongoose.connect(url)
  .then( () => {
    console.log('connected to mongodb')
  })
  .catch(err => {
    console.log('failed to connect to db ', err.message)
  })

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      minLength: 8,
      validate:{ validator: v => {
        return v[3] === '-'
      } },
      required: true
    }
  }
)

personSchema.set('toJSON', {
  transform: (doc, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)