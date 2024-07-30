require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./model/person');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

morgan.token('post-body', (req, res) => {
    return req.method === 'POST' ?  JSON.stringify(req.body) : null;
}); 

app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :post-body'));

const url = process.env.MONGODB_URI;
let persons = [
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
];

app.get('/info', (req, res) => {
    const responseInfo = `
        Phonebook has info for ${persons.length} people
        <br/>
        ${new Date()}
    `;
    res.send(responseInfo);
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => res.json(result));
});

app.get('/api/persons/:id', (req,res) => {
    const id = req.params.id;
    Person.findById(id)
        .then( person => res.json(person) )
        .catch( error => res.status(404).end() );
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(202).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req,res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name and/or number is missing'
        });
    }

    // ignore duplicates at this stage
    // if (persons.find(p => p.name === body.name)){
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     });
    // }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    });

    newPerson.save().then(addedPerson => {
        res.status(200).json(addedPerson);
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'});
};

const errorHandler = (error, request, response, next) => {
    console.log(error);
    next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));