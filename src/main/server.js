import express from 'express'
import expressWs from 'express-ws'

const server =  { app: null }

const createServer = (port) => {
    if (server.app == null) {
        server.app = express()
        const { app } = server
        app.get("/", (req, res) => {
            res.json({msg: "hello"})
        })
        app.listen(port)
    }
}

export { createServer }