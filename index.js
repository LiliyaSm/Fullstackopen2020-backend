require('dotenv').config()

const express = require('express')
const app = express()
const Person = require('./models/person')

// request logger middleware
const morgan = require('morgan')

const cors = require('cors')

// for  parsing incoming requests with JSON payloads
app.use(express.json())

app.use(cors())

// makes express show static content
app.use(express.static('build'))

// app.use(morgan("tiny"));

// callback function is expected to return a string value
morgan.token('person', function (req, res) {
  return JSON.stringify(req.body)
})
// format string of predefined tokens
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person'
  )
)

//get all phonebook entries
app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => {
    response.json(result)
    result.forEach((person) => {
      console.log(person)
    })
  })
})

// displays number of entries and current date
app.get('/info', (request, response) => {
  let today = new Date()
  // let date = today.toUTCString();
  Person.countDocuments({}).then((result) => {
    response.send(
      `<p>Phonebook has info for ${result} people </p> 
             <p>${today}</p>`
    )
  })
})

// get single entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

//update entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  // event handler will be called with the new modified document instead of the original
  // A.findByIdAndUpdate(id, update, options, callback)
    
  Person.findByIdAndUpdate(request.params.id, person, {
    // enable mongoose validators
    runValidators: true,
    //plugin mongoose-unique-validator requires setting the context option
    context: 'query',
    new: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

//delete entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      console.log(result)
      response.status(204).end()
    })
    .catch((error) => {
      console.log(error)
      return next(error)
    })
})

// create new entry
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing',
    })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  console.log(newPerson)

  // data sent back in the response is formatted
  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson.toJSON())
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // id doesn't match the mongo identifier format
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  //  pass the error forward to the default Express error handler.
  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
