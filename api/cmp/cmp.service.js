const dbService = require('../../services/db.service');
// const utilService = require('../../services/utilService.js');
const ObjectId = require('mongodb').ObjectId;

async function query(filterBy) {
  // const criteria = _buildCriteria(filterBy);
  const criteria = {};

  const collection = await dbService.getCollection('cmp');
  var cmps = await collection.find(criteria).toArray();
  // console.log(cmps);
  return cmps;
}

async function getById(cmpId) {
  const collection = await dbService.getCollection('cmp');
  const cmp = collection.findOne({_id: ObjectId(cmpId)});
  return cmp;
}

async function remove(cmpId) {
  const collection = await dbService.getCollection('cmp');
  await collection.deleteOne({_id: ObjectId(cmpId)});
  return cmpId;
}

async function add(cmp) {
  const collection = await dbService.getCollection('cmp');
  const addedCmp = await collection.insertOne(cmp);
  return addedCmp;
}
async function update(cmp) {
  var id = ObjectId(cmp._id);
  delete cmp._id;
  const collection = await dbService.getCollection('cmp');
  await collection.updateOne({_id: id}, {$set: {...cmp}});
  return cmp;
}

// async function addReview(review, cmpId) {
//   try {
//     const collection = await dbService.getCollection('cmp');
//     review.id = utilService.makeId();
//     review.createdAt = Date.now();
//     await collection.updateOne(
//       {_id: ObjectId(cmpId)},
//       {$push: {reviews: review}}
//     );
//     return review;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};

function _buildCriteria(filterBy) {
  const criteria = {};

  // filter by name
  if (filterBy.name) {
    const regex = new RegExp(filterBy.name, 'i');
    criteria.name = {$regex: regex};
  }

  // // filter by inStock
  // if (filterBy.inStock !== 'All') {
  //   criteria.inStock = {$eq: JSON.parse(filterBy.inStock)};
  // }

  // // filter by type
  // if (filterBy.type !== 'All') {
  //   criteria.type = {$eq: filterBy.type};
  // }

  return criteria;
}
