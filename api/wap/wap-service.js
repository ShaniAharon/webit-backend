const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  remove,
  add,
  update,
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
    const collection = await dbService.getCollection('wap')
    const wap = collection.findOne({ _id: ObjectId(wapId) })
    // wap.cmps = wap.cmps.map((cmp)=>{
    //   cmp._id = utilService.makeId()
    //   return cmp
    // })
    return wap
  } catch (err) {
    logger.error(`while finding wap ${wapId}`, err)
    throw err
  }
}

async function remove(wapId) {
  console.log('FROM service', wapId)
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
  console.log('UPDATED')
  try {
    // console.log('wap', wap); // dont change the database
    const copyWapId = wap._id //return the changes to  the store
    var id = ObjectId(wap._id)
    delete wap._id //why remove the id??? check if its bad ,
    // need to remove the id but in the front we need the id
    const collection = await dbService.getCollection('wap')
    await collection.updateOne({ _id: id }, { $set: { ...wap } })
    // updatedWap._id = id;
    // console.log(wap);
    wap._id = copyWapId //return the id work!!
    return wap
  } catch (err) {
    logger.error(`cannot update wap ${wap._id}`, err)
    throw err
  }
}

async function add(wap) {
  try {
    const collection = await dbService.getCollection('wap')
    console.log('23478 collection', collection)
    const addedWap = await collection.insertOne(wap)
    // console.log('addedWap:', addedWap)
    return wap
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

  console.log(wapsToShow.length)
  if (!filterBy.labels) return wapsToShow

  wapsToShow = wapsToShow.filter(wap => {
    return filterBy.labels.every(label => wap.labels.includes(label))
  })

  return wapsToShow
}
