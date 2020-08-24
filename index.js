const express = require("express");
const morgan = require("morgan");

const app = express();

// for  parsing incoming requests with JSON payloads
app.use(express.json());
app.use(morgan("tiny"));

morgan.token("type", function (req, res) {
    return req.body;
});

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1,
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2,
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3,
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4,
    },
    {
        name: "w",
        number: "w",
        id: 5,
    },
];

app.get("/api/persons", (request, response) => {
    if (persons) {
        response.json(persons);
    } else {
        response.status(404).end();
    }
});

app.get("/info", (request, response) => {
    let entries = persons.length;
    var today = new Date();
    var date = today.toUTCString();

    response.send(
        `<p>Phonebook has info for ${entries} people </p> <p>${date}</p>`
    );
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    console.log(id);
    const person = persons.find((person) => person.id === id);
    console.log(person);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(100000));
};

// create new entry
app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "The name or number is missing",
        });
    }

    if (persons.some((person) => person.name === body.name)) {
        return response.status(400).json({
            error: "Name must be unique",
        });
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };
    console.log(newPerson);
    persons = persons.concat(newPerson);

    response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT);
