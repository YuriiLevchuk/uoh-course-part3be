require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

const app = express()

// middleware //
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
morgan.token('request-body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))


// get //
app.get('/api/persons', (req, res) => {
  Person.find({}).then( db => {
    res.json(db)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then( record => {
      if(record){ res.json(record) }
      else{ res.status(404).send({ error:`no existing record with ${id} id` })}
    })
    .catch( err => next(err))
})

app.get('/info', (req, res, next) => {
  const d = new Date()
  console.log(d)

  Person.countDocuments({})
    .then( count => {
      res.send(
        `<div>
          Phonebook has info for ${count} people <br/>
          ${d.toString()}</div>`
      )
    })
    .catch( err => next(err) )
})

// delete //
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then( () => { res.status(204).end() })
    .catch( err => next(err) )
})

// post //
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if(!body.name){
    return res.status(400).json( { error: 'record name was not given' } )
  } else if(!body.number){
    return res.status(400).json( { error: 'record number was not given' } )
  }
  // else if(phonebook.find(el => el.name === body.name)){
  //   return res.status(400).json( {error: "name must be unique"} );
  // }

  const newRecord = new Person({
    name : body.name,
    number : body.number
  })

  newRecord.save()
    .then( savedPerson => {
      res.json(savedPerson)
    })
    .catch( err => next(err) )
})

// put //
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, { name, number },
    { new:true, runValidators:true, context:'query' })
    .then( el => {res.json(el)} )
    .catch( err => {next(err)} )
})

// handling unknown endpoint //
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error:'unknown path' })
}
app.use(unknownEndpoint)

// handling errors //
const handleError = (err, req, res, next) => {
  console.error(err)

  if(err.name === 'CastError'){
    return res.status(404).send({ error: 'malformated id' })
  } else if(err.name === 'ValidationError'){
    return res.status(404).send({ error: err.message })
  };

  next(err)
}
app.use(handleError)

// launch //
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Alive on: http://localhost:${PORT}`)
})