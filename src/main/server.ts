import express, { Express } from 'express'
import cors from 'cors'
import expressWs from 'express-ws'
import { app as electronApp } from 'electron'
import { serve, setup } from 'swagger-ui-express'
import { router } from './routes'
import YAML from 'yamljs'
import spec from '../../resources/openapi.spec.yaml?asset'
import { Server } from 'http'

type ServerType = {
  app: Express | null
  httpServer: Server | null
}

const server: ServerType = {
  app: null,
  httpServer: null
}

function defineRoutes(app: Express): Express {
  app.use(express.json())
  app.use(cors())
  app.use('/', router)

  if (!electronApp.isPackaged) {
    const specDoc = YAML.load(spec)
    app.use('/api-docs', serve, setup(specDoc))
  }

  return app
}

function createServer(hostname, port): void {
  closeServer()
  server.app = express()
  const app: Express = defineRoutes(server.app)
  server.httpServer = app.listen(port, hostname)
}

function closeServer(): void {
  if (server.app !== null && server.httpServer !== null) {
    server.httpServer.close(() => console.log('Server shutdown'))
  }
}

export { createServer, closeServer }
