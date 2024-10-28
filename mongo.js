const mongoose = require('mongoose');

if(process.argv.length<3){
  console.log('password; name; phone');
  process.exit(1);
}

const password = process.argv[2];

const url = 
`mongodb+srv://yuriilevchuk04:${password}@cluster0.54lr5.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

if(process.argv.length<5){
  console.log('phonebook:')

  Person
    .find({})
      .then(( res )=>{
        res.forEach(el => {
          console.log(el.name + ' ' + el.number);
        });
        mongoose.connection.close();
      });

} else{
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result=>{
    console.log(`Added ${name} number ${number} to phonebook`)
    // console.log(result);
    mongoose.connection.close();
  })
}

// Note.find({ important:true }).then((result)=>{
//   result.forEach(note => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// })