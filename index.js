
const express = require('express');
const app = express();
app.use(express.json());

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
    res.json(persons);
});

app.get('/api/persons/:id', (req,res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    
    if (!person){
        return res.status(404).end();
    }

    res.json(person);
});

app.delete('/api/persons/:id', (req,res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(202).end();
});

app.post('/api/persons', (req,res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name and/or number is missing'
        });
    }

    if (persons.find(p => p.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: String(getRandomId(10000)),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);
    res.status(200).json(person);
});

const getRandomId = (max) => Math.floor(Math.random() * max);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));