const express = require('express')
const app = express()

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-01-10T19:20:14.298Z",
    important: true
  }
]

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// MIDDLEWARE
app.use(express.json())
app.use((req, res, next) => {
  req.reqTime = new Date();
  next();
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = (data) => {
  const maxId = data.length > 0
    ? Math.max(...data.map(n => n.id))
    : 0
  return maxId + 1
}

// Exercise 3.5: add new person to phonebook
app.post('/api/persons', (req, res) => {
  const body = req.body;
  if(!body.name || !body.number) {
    return res.status(400).json({ error: 'You must enter a name and a phone number.' })
  };

  const phoneNum = {
    id: generateId(persons),
    name: body.name,
    number: body.number
  }

  persons.concat(phoneNum)

  res.json(phoneNum);
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(notes),
  }

  notes = notes.concat(note)

  res.json(note)
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

// Exercise 3.1
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// Exercise 3.2
app.get('/info', (req, res) => {
  let reqTime = req.reqTime;
  res.send(`<p>Phonebook has info for ${persons.length} people</p>${reqTime}`)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

// Exercise 3.4
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id);
  res.status(204).end('Successfully deleted resource');
})

// Exercise 3.3
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(num => num.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end('404 not found')
  }
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})