
import { Router } from "express"

const router = Router()

router.get('/', (req, res) => {
    res.json({ api: 'share-play-v1', version: 0.1 })
})


export { router }