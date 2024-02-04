import { Router } from 'express'
import { createHash } from 'crypto'
import * as fs from 'fs'
import { app } from 'electron'

type FileMetadataType = {
  lastModified: string
  fileSize: number
}

const router = Router()
const hashCacheFilepath = app.getPath('userData') + 'checksums.cache'

const readChecksums = () => {
  return new Promise((resolve) => {
    fs.readFile(hashCacheFilepath, (err, data) => {
      try {
        resolve(JSON.parse(data))
      } catch (e) {
        resolve({})
      }
    })
  })
}

const writeChecksums = (checksums) => {
  return new Promise((resolve) => {
    fs.writeFile(hashCacheFilepath, JSON.stringify(checksums), () => resolve())
  })
}

const getChecksum = (filepath: string): Promise<string> => {
  return new Promise((resolve) => {
    const chunkSize = 4096
    const md5hash = createHash('md5')
    const fstream = fs.createReadStream(filepath, { highWaterMark: chunkSize })
    fstream.on('data', (chunk) => {
      md5hash.update(chunk)
    })
    fstream.on('end', () => {
      const checksum = md5hash.digest('hex')
      resolve(checksum)
    })
  })
}

const getFileMetadata = (filepath): Promise<FileMetadataType> => {
  return new Promise((resolve) => {
    fs.stat(filepath, (err, stat) =>
      resolve({
        lastModified: stat.mtime.toISOString(),
        fileSize: stat.size / (1024 * 1024)
      })
    )
  })
}

router.get('/', (req, res) => {
  res.json({ api: 'share-play-v1', version: 0.1 })
})

router.get('/videos', async (req, res) => {
  const checksums = await readChecksums()
  res.json(checksums)
})

router.post('/videos', async (req, res) => {
  const { filepath } = req.body
  console.log(filepath)
  const checksums = await readChecksums()

  Promise.all([getChecksum(filepath), getFileMetadata(filepath)])
    .then(([checksum, { lastModified, fileSize }]) => {
      return new Promise(async (resolve) => {
        const data = {
          checksum,
          filepath,
          lastModified,
          fileSize
        }
        checksums[checksum] = data
        await writeChecksums(checksums)
        resolve(data)
      })
    })
    .then((data) => res.json(data))
})

router.patch('/videos', async (req, res) => {
  const { checksum } = req.body
  const checksums = await readChecksums()
  if (checksums.hasOwnProperty(checksum)) {
    delete checksums[checksum]
    await writeChecksums(checksums)
    res.json({
      checksum,
      removed: true
    })
  } else {
    res.json({
      checksum,
      removed: false
    })
  }
})

export { router }
