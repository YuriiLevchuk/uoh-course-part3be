const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to url: ', url);

mongoose.connect(url)
  .then(res =>{
    console.log('connected to mongodb');
  })
  .catch(err =>{
    console.log('failed to connect to db ', err.message);
  })

const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String
  }
)

personSchema.set('toJSON', {
  transform: (doc, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema)