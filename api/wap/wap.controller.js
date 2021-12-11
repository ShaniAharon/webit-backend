const wapService = require('./wap-service.js')
const logger = require('../../services/logger.service')
const utilService = require('../../services/utilService.js')

//add updateCmp removeCmp addCmp copyCmp, removeEl ?getEmptyWap

//wap List
async function getWaps(req, res) {
  try {
    var queryParams = req.query
    const waps = await wapService.query(queryParams)
    res.json(waps)
  } catch (err) {
    logger.error('Failed to get waps', err)
    res.status(500).send({ err: 'Failed to get waps' })
  }
}
// GET BY ID
async function getWapById(req, res) {
  console.log('req.params.id', req.params.id)
  try {
    const wapId = req.params.id
    if (!wapId) return res.end('I dont have ID in the params')
    const wap = await wapService.getById(wapId)
    res.json(wap)
  } catch (err) {
    console.log(err)
    logger.error('Failed to get wap', err)
    res.status(500).send({ err: 'Failed to get wap' })
  }
}

// POST (add wap)
async function addWap(req, res) {
  try {
    const wap = req.body
    const addedWap = await wapService.add(wap, req.session.user)
    res.json(addedWap)
  } catch (err) {
    logger.error('Failed to add wap', err)
    res.status(500).send({ err: 'Failed to add wap' })
  }
}

// PUT (Update wap)
async function updateWap(req, res) {
  try {
    const wap = req.body
    // console.log("wap to update from store",wap);
    const updatedWap = await wapService.update(wap)
    res.json(updatedWap)
  } catch (err) {
    logger.error('Failed to update wap', err)
    res.status(500).send({ err: 'Failed to update wap' })
  }
}

// DELETE (Remove wap)
async function removeWap(req, res) {
  try {
    const wapId = req.params.id
    const removedId = await wapService.remove(wapId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove wap', err)
    res.status(500).send({ err: 'Failed to remove wap' })
  }
}
//*****-> keep all the logic in the front service and only pass the wap to update in the backend */
//ask if need to add this logic/funcs in the wap-service or its ok to use the func's that are there
//new functions to add from front service //need wapId, cmp, idx
//also add in the routes******* important
async function addCmp(req, res) {
  //check if need to add addCmp func in the wap.service that do the logic and not in the controller
  try {
    const wapId = req.params.id
    const { cmp, idx } = req.body // data obj need to contain cmp, and idx -> from the dnd
    var wap = await wapService.getById(wapId)
    wap.cmps.splice(idx, 0, cmp)
    const updatedWap = await wapService.update(wap)
    res.json(updatedWap)
  } catch (err) {
    logger.error('Failed to add cmp', err)
    res.status(500).send({ err: 'Failed to add cmp' })
  }
}

async function updateCmp(req, res) {
  //need wapId, newCmp
  try {
    const wapId = req.params.id
    const newCmp = req.body //need to send from the front service the cmp
    var wap = await wapService.getById(wapId)
    const idx = wap.cmps.findIndex(cmp => cmp.id === newCmp.id)
    wap.cmps.splice(idx, 1, newCmp)
    const updatedWap = await wapService.update(wap)
    res.json(updatedWap)
  } catch (err) {
    logger.error('Failed to update cmp', err)
    res.status(500).send({ err: 'Failed to update cmp' })
  }
}

async function removeCmp(req, res) {
  //need wapId, cmpId
  try {
    const wapId = req.params.id
    const cmpId = req.body //need to send from the front service the cmpId
    var wap = await wapService.getById(wapId)
    const idx = wap.cmps.findIndex(cmp => cmp.id === cmpId)
    wap.cmps.splice(idx, 1)
    const updatedWap = await wapService.update(wap)
    res.json(updatedWap)
  } catch (err) {
    logger.error('Failed to remove cmp', err)
    res.status(500).send({ err: 'Failed to remove cmp' })
  }
}

async function copyCmp(req, res) {
  //ask if this func need to be only in the store using the currWap
  //need wapId, cmpId
  try {
    const wapId = req.params.id
    const cmpId = req.body //need to send from the front service the cmpId
    var wap = await wapService.getById(wapId)
    const cmp = wap.cmps.find(cmp => cmp.id === cmpId)
    const newCopyCmp = JSON.parse(JSON.stringify(cmp))
    newCopyCmp.id = utilService.makeId() //change id soo it will not duplicate
    res.json(newCopyCmp) //only copy a cmp and return the copy myaby need to be in the store only
  } catch (err) {
    logger.error('Failed to remove cmp', err)
    res.status(500).send({ err: 'Failed to remove cmp' })
  }
}

module.exports = {
  getWaps,
  getWapById,
  addWap,
  updateWap,
  removeWap,
}
