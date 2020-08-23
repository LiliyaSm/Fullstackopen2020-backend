const express = require("express");
const app = express();

app.get("/api/persons", (request, response) => {
    
    if (persons) {
        response.json(persons);
    } else {
        response.status(404).end();
    }
});


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "w",
      "number": "w",
      "id": 5
    }
  ]


  const PORT = 3001;
  app.listen(PORT);