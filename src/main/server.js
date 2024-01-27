import express from 'express'
import cors from 'cors'
import expressWs from 'express-ws'

const server = {
  app: null,
  httpServer: null
}

const defineRoutes = (app) => {
  app.use(cors())
  app.get('/', (req, res) => {
    res.json({ api: 'share-play-v1', version: 0.1 })
  })

  return app
}

const createServer = (hostname, port) => {
  if (server.httpServer != null) {
    server.httpServer.close(() => console.log('Server shutdown'))
  }
  server.app = express()
  const app = defineRoutes(server.app)
  server.httpServer = app.listen(port, hostname)
}

export { createServer }
