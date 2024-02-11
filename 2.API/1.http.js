const http = require('node:http')
const fs = require('node:fs')
// Variable de entorno para decidir el puerto que se desea abri
// por predeterminador (si no se declare la Variable) es el port 1234.
const desiredPort = process.env.PORT ?? 1234

// Función que se realiza cada vez que el usuario
// hace un request al servidor.
const processRequest = (req, res) => {
  res.setHeader('Content-type', 'text/html; charset=utf-8')
  if (req.url === ('/')) {
    res.end('<h1>Bienvenido a mi página de inicio</h1>')
  } else if (req.url === '/imagen.png') {
    fs.readFile('./StatusCode.png', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('<h1>500 Internal Server Error</h1>')
      } else {
        res.setHeader('Content-type', 'image/png')
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.end('<h1>Contacto</h1>')
  } else {
    res.end('<h1>404</h1>')
  }
}

// Se crea el servidor llamanado a la función
const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`server listening on port http://localhost:${desiredPort}`)
})
