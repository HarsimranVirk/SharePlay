import express from 'express'
import cors from 'cors'
import expressWs from 'express-ws'
import { app as electronApp } from 'electron' 
import { serve, setup } from 'swagger-ui-express'
import { router } from './routes'
import YAML from 'yamljs'
import spec from "../../resources/openapi.spec.yaml?asset"

const server = {
  app: null,
  httpServer: null
}

function defineRoutes(app) {
  app.use(cors())
  app.use("/", router)
  
  if (!electronApp.isPackaged) {
    const specDoc = YAML.load(spec)
    app.use(
      "/api-docs",
      serve,
      setup(specDoc)
    )
  }

  return app
}

function createServer(hostname, port) {
  closeServer()
  server.app = express()
  const app = defineRoutes(server.app)
  server.httpServer = app.listen(port, hostname)
}

function closeServer() {
  if (server.app !== null && server.httpServer !== null) {
    server.httpServer.close(() => console.log("Server shutdown"))
  }
}

export { createServer, closeServer }
