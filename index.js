const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

let phonebook =
[
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res)=>{
  res.json(phonebook);
})

app.get('/api/persons/:id', (req, res)=>{
  id = req.params.id;
  const record = phonebook.find(el=> el.id===id);
  if(record) { res.json(record) }
  else{
    //res.statusMessage = `element with ${id} id doesnt exist`;
    res.status(404).end();
  }
})

app.get('/info', (req, res)=>{
  d = new Date();
  console.log(d);

  res.send(
    `<div>
      Phonebook has info for ${phonebook.length} people <br/>
      ${d.toString()}
    </div>`
  );
})

app.delete('/api/persons/:id', (req, res)=>{
  id = req.params.id;
  phonebook = phonebook.filter(el => el.id!==id);

  res.status(204).end();
})

app.post('/api/persons', (req, res)=>{
  const body = req.body;
  if(!body.name){
    return res.status(400).json( {error: "record name was not given"} );
  } else if(!body.number){
    return res.status(400).json( {error: "record number was not given"} );
  } else if(phonebook.find(el => el.name === body.name)){
    return res.status(400).json( {error: "name must be unique"} );
  }

  const randId = String(Math.floor(Math.random() * 99999999999));
  console.log(randId);
  const newRecord = {
    name : body.name,
    number : body.number || null,
    id: randId
  }
  phonebook = phonebook.concat(newRecord);
  res.json(newRecord);
})

app.listen(PORT, ()=>{
  console.log(`Alive on: http://localhost:${PORT}`);
})