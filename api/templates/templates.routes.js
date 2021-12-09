const express = require('express')
const { log } = require('../../middlewares/logger.middleware')
const {
  getTemplates,
  getTemplateById,
  createNewWap,
} = require('./templates.controller')
const router = express.Router()

router.get('/', log, getTemplates)
router.get('/:id', getTemplateById)
router.post('/', createNewWap)

module.exports = router
