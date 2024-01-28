import { Router } from "express"
import { createHash } from 'crypto'
import * as fs from 'fs'


const router = Router()

const getChecksum = (filepath) => {
    return new Promise(resolve => {
        const chunkSize = 4096;
        const md5hash = createHash("md5")
        const fstream = fs.createReadStream(filepath, {'highWaterMark': chunkSize})
        fstream.on("data", (chunk) => {
            md5hash.update(chunk)
        })
        fstream.on("end", () => {
            const checksum = md5hash.digest('hex')
            resolve(checksum)
        })
    })
} 

const getLastModified = (filepath) => {
    return new Promise(resolve => {
        fs.stat(filepath, (err, stat) => resolve(stat.mtime.toISOString()))
    })
}

router.get('/', (req, res) => {
    res.json({ api: 'share-play-v1', version: 0.1 })
})

router.post("/add", async (req, res) => {
    const { filepath } = req.body

    Promise.all([getChecksum(filepath), getLastModified(filepath)])
        .then(([checksum, lastModified]) => res.json({
            filepath,
            checksum,
            lastModified
        }))
})


export { router }