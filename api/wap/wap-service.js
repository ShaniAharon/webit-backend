const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  remove,
  add,
  update,
  undo,
}

async function query(filterBy) {
  try {
    // const criteria = _buildCriteria(filterBy)
    const criteria = {}

    const collection = await dbService.getCollection('wap')
    var waps = await collection.find(criteria).toArray()

    // let filteredWaps = filterWaps(filterBy, waps);

    return waps
  } catch (err) {
    logger.error('cannot find waps', err)
    throw err
  }
}

async function getById(wapId) {
  try {
    if (!wapId) throw 'Wapid malformed'
    console.log('🚀 ~ file: wap-service.js ~ line 34 ~ getById ~ wapId', wapId)

    const collection = await dbService.getCollection('wap')
    const wap = await collection.findOne({ _id: ObjectId(wapId + '') })
    return wap
  } catch (err) {
    logger.error(`while finding wap ${wapId}`, err)
    throw err
  }
}

async function remove(wapId) {
  // console.log('FROM service', wapId);
  try {
    const collection = await dbService.getCollection('wap')
    await collection.deleteOne({ _id: ObjectId(wapId) })
    return wapId
  } catch (err) {
    logger.error(`cannot remove wap ${wapId}`, err)
    throw err
  }
}

async function update(wap) {
  try {
    let wapFromDb = await getById(wap._id)
    let id = wap._id
    delete wap._id
    let newWap = JSON.parse(JSON.stringify(wap))
    newWap.wapHistory.push(JSON.parse(JSON.stringify(wapFromDb.cmps)))
    console.log('NEW WAP HISTORY \n\n\n\n', newWap.wapHistory)
    const collection = await dbService.getCollection('wap')
    delete newWap._id
    const updatedWap = await collection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: newWap }
    )
    newWap._id = id
    return newWap
  } catch (err) {
    logger.error(`cannot update wap ${wap._id}`, err)
    throw err
  }
}

async function undo(wap) {
  try {
    let wapFromDb = await getById(wap._id)
    let id = wapFromDb._id
    delete wapFromDb._id
    let newWap = { ...wapFromDb }
    if (newWap.wapHistory.length > 0) {
      console.log('ANI HINAS')
      newWap.cmps = newWap.wapHistory.pop()
    }
    const collection = await dbService.getCollection('wap')
    const updatedWap = await collection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: newWap }
    )
    newWap._id = id
    return newWap
  } catch (err) {
    logger.error(`cannot update wap ${wap._id}`, err)
    throw err
  }
}

async function add(wap, user) {
  console.log(
    '############## ~ file: wap-service.js ~ line 106 ~ add ~ wap',
    wap
  )
  try {
    const collection = await dbService.getCollection('wap')
    // console.log('23478 collection', collection);
    const newWap = {
      ...wap,
      _id: null,
      createdAt: Date.now(),
      createdBy: user,
    }
    const addedWap = await collection.insertOne(newWap)
    console.log('addedWap:', addedWap.ops[0])
    return addedWap.ops[0]
  } catch (err) {
    logger.error('cannot insert wap', err)
    throw err
  }
}

function filterWaps(filterBy, wapsToShow) {
  if (
    Object.keys(filterBy).length === 0 ||
    !filterBy ||
    (filterBy.title === '' && filterBy.label < 1)
  ) {
    return wapsToShow
  }
  const searchStr = filterBy.title.toLowerCase()
  wapsToShow = wapsToShow.filter(wap => {
    return wap.name.toLowerCase().includes(searchStr)
  })
  const isInStock = filterBy.selectOpt === 'stock'

  wapsToShow = wapsToShow.filter(
    wap => filterBy.selectOpt === 'All' || wap.inStock === isInStock
  )

  // console.log(wapsToShow.length);
  if (!filterBy.labels) return wapsToShow

  wapsToShow = wapsToShow.filter(wap => {
    return filterBy.labels.every(label => wap.labels.includes(label))
  })

  return wapsToShow
}
