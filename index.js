require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./modules/Person');

const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
morgan.token('request-body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'));


//get
app.get('/api/persons', (req, res)=>{
  Person.find({}).then( db=>{
    res.json(db);
  })
})

app.get('/api/persons/:id', (req, res)=>{
  id = req.params.id;
  Person.findById(id)
    .then( record=>{
      res.json(record);
    })
    .catch( err=>{
      res.status(404).send({ error:`no existing record with ${id} id` });
    })
})

app.get('/info', (req, res)=>{
  d = new Date();
  console.log(d);

  res.send(
    `<div>
      Phonebook has info for ${phonebook.length} people <br/>
      ${d.toString()}</div>`
  );
})

//delete
app.delete('/api/persons/:id', (req, res)=>{
  id = req.params.id;
  phonebook = phonebook.filter(el => el.id!==id);

  res.status(204).end();
})

//post
app.post('/api/persons', (req, res)=>{
  const body = req.body;
  if(!body.name){
    return res.status(400).json( {error: "record name was not given"} );
  } else if(!body.number){
    return res.status(400).json( {error: "record number was not given"} );
  } 
  // else if(phonebook.find(el => el.name === body.name)){
  //   return res.status(400).json( {error: "name must be unique"} );
  // }

  const newRecord = new Person({
    name : body.name,
    number : body.number
  })

  newRecord.save().then( savedPerson=>{
    res.json(savedPerson);
  })
})

const unknownEndpoint = (req, res)=>{
  res.status(404).send({ error:"unknown path" })
}
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
  console.log(`Alive on: http://localhost:${PORT}`);
})