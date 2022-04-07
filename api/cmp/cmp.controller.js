const cmpService = require('./cmp.service.js');
const logger = require('../../services/logger.service');
const utilService = require('../../services/utilService.js');

module.exports = {
  getCmps,
  getCmpById,
  addCmp,
  updateCmp,
  removeCmp,
  addReview,
};

// GET LIST
async function getCmps(req, res) {
  try {
    var queryParams = req.query;
    const cmps = await cmpService.query(queryParams);
    console.log('GETTING CMPS : ', cmps);
    res.json(cmps);
  } catch (err) {
    logger.error('Failed to get cmps', err);
    res.status(500).send({ err: 'Failed to get cmps' });
  }
}

// async function getCmpById(id) { //front reference
//   const cmp = gCmps.find((currCmp) => currCmp.id === id);
//   const copyCmp = JSON.parse(JSON.stringify(cmp));
//   copyCmp.id = utilService.makeId(); //change id soo it will not duplicate
//   return Promise.resolve(copyCmp);
// }

// GET BY ID
async function getCmpById(req, res) {
  try {
    const cmpId = req.params.id;
    const cmp = await cmpService.getById(cmpId);
    delete cmp._id;
    cmp.id = utilService.makeId();
    const copyCmp = JSON.parse(JSON.stringify(cmp));
    console.log(copyCmp); //test if the id change -> maybe the inner ids need to change too
    res.json(copyCmp);
  } catch (err) {
    logger.error('Failed to get cmp', err);
    res.status(500).send({ err: 'Failed to get cmp' });
  }
}

// POST (add cmp)
async function addCmp(req, res) {
  try {
    const cmp = req.body;
    // console.log(cmp);
    const addedCmp = await cmpService.add(cmp);
    res.json(addedCmp);
  } catch (err) {
    logger.error('Failed to add cmp', err);
    res.status(500).send({ err: 'Failed to add cmp' });
  }
}

// PUT (Update cmp)
async function updateCmp(req, res) {
  try {
    const cmp = req.body;
    const updatedCmp = await cmpService.update(cmp);
    res.json(updatedCmp);
  } catch (err) {
    logger.error('Failed to update cmp', err);
    res.status(500).send({ err: 'Failed to update cmp' });
  }
}

// DELETE (Remove cmp)
async function removeCmp(req, res) {
  try {
    const cmpId = req.params.id;
    const removedId = await cmpService.remove(cmpId);
    res.send(removedId);
  } catch (err) {
    logger.error('Failed to remove cmp', err);
    res.status(500).send({ err: 'Failed to remove cmp' });
  }
}

async function addReview(req, res) {
  //need to change it work with reviews service
  const cmpId = req.params.id;
  const review = req.body;
  try {
    const addedReview = await cmpService.addReview(review, cmpId);
    res.send(addedReview);
  } catch (err) {
    res.status(500).send(err);
  }
}
