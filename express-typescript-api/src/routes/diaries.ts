import express from 'express'
import * as diaryServices from '../services/diary'
import toNewDiaryEntry from '../utils'

const router = express.Router()

router.get('/', (_, res) => {
  res.send(diaryServices.getEnriesWithoutSensitiveInfo())
})

router.get('/:id', (req, res) => {
  const diary = diaryServices.findById(Number(req.params.id))
  res.send(diary)
})

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body)
    const addedDiaryEntry = diaryServices.addDiary(newDiaryEntry)
    res.status(200).json(addedDiaryEntry)
  } catch (e) {
    res.status(400).send(e)
  }
})

export default router
