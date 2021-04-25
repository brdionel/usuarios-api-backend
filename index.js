const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')

app.use(express.json())

app.use(logger)

let usuarios = [
  {
    id: 1,
    nombre: 'Bruno',
    apellido: 'Vicente',
    fechaIngreso: '24/4/2021',
    horaIngreso: '17:45',
    estrecho: false,
    sintoma: false,
    firma: true
  },
  {
    id: 2,
    nombre: 'Ale',
    apellido: 'Figueroa',
    fechaIngreso: '24/4/2021',
    horaIngreso: '17:45',
    estrecho: false,
    sintoma: false,
    firma: true
  },
  {
    id: 3,
    nombre: 'Nora',
    apellido: 'Rivero',
    fechaIngreso: '24/4/2021',
    horaIngreso: '17:45',
    estrecho: false,
    sintoma: false,
    firma: true
  }
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json'})
//   response.end(JSON.stringify(usuarios))
// })

app.get('/', (request, response, next) => {
  // cuándo se entra a este path, la response va a devolver:
  response.send('<h1> Hello world </h1>')
  next()
})

app.get('/api/users', (request, response) => {
  response.json(usuarios)
})

app.post('/api/users', (request, response) => {
  const ids = usuarios.map(user => user.id)
  const maxId = Math.max(...ids)

  const { nombre, apellido, estrecho, sintoma, firma } = request.body

  if (!nombre) {
    return response.status(400).json({
      error: 'usuario.nombre is missing'
    })
  }

  const nuevoUsuario = {
    id: maxId + 1,
    nombre,
    apellido,
    fechaIngreso: new Date().toISOString(),
    horaIngreso: new Date().getHours(),
    estrecho,
    sintoma,
    firma: firma || true
  }

  usuarios = [...usuarios, nuevoUsuario]

  response.status(201).json(nuevoUsuario)
})

app.get('/api/user/:id', (request, response) => {
  const id = +request.params.id
  const user = usuarios.find(user => user.id === id)
  if (user) {
    response.send(user)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/user/:id', (request, response) => {
  const id = +request.params.id
  usuarios = usuarios.filter(user => user.id !== id)
  response.status(204).end()
})

app.use((request, response) => {
  response.status(404).json({
    error: 'not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
