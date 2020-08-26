require("dotenv").config();

const express = require("express");
const app = express();
const Person = require("./models/person");

// request logger middleware
const morgan = require("morgan");

const cors = require("cors");

// for  parsing incoming requests with JSON payloads
app.use(express.json());

app.use(cors());

// makes express show static content
app.use(express.static("build"));

// app.use(morgan("tiny"));

// callback function is expected to return a string value
morgan.token("person", function (req, res) {
    return JSON.stringify(req.body);
});
// format string of predefined tokens
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :person"
    )
);

// let persons = [
//     {
//         name: "Arto Hellas",
//         number: "040-123456",
//         id: 1,
//     },
//     {
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//         id: 2,
//     },
//     {
//         name: "Dan Abramov",
//         number: "12-43-234345",
//         id: 3,
//     },
//     {
//         name: "Mary Poppendieck",
//         number: "39-23-6423122",
//         id: 4,
//     },
// ];

//get all phonebook entries
app.get("/api/persons", (request, response) => {
    Person.find({}).then((result) => {
        response.json(result);
        result.forEach((person) => {
            console.log(person);
        });
    });
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

    // if (persons.some((person) => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: "Name must be unique",
    //     });
    // }

    const newPerson = new Person ({
        name: body.name,
        number: body.number,
    })

    console.log(newPerson);


    // data sent back in the response is formatted 
    newPerson.save().then((savedPerson) => {
        response.json(savedPerson);
    });

    // persons = persons.concat(newPerson);
    // response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
