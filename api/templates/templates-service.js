const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  query,
  getById,
  remove,
  add,
  update,
};

async function query(filterBy) {
  try {
    // const criteria = _buildCriteria(filterBy)
    const criteria = {};
    const collection = await dbService.getCollection('template');
    var templates = await collection.find(criteria).toArray();

    // let filteredTemplates = filterTemplates(filterBy, templates);

    return templates;
  } catch (err) {
    logger.error('cannot find templates', err);
    throw err;
  }
}

async function getById(templateId) {
  try {
    if (!templateId) throw 'Tamplate ID Malformed';
    const collection = await dbService.getCollection('template');
    const template = collection.findOne({ _id: ObjectId(templateId) });
    return template;
  } catch (err) {
    logger.error(`while finding template ${templateId}`, err);
    throw err;
  }
}

async function remove(templateId) {
  // console.log('FROM service', templateId);
  try {
    const collection = await dbService.getCollection('template');
    await collection.deleteOne({ _id: ObjectId(templateId) });
    return templateId;
  } catch (err) {
    logger.error(`cannot remove template ${templateId}`, err);
    throw err;
  }
}

async function update(template) {
  console.log('UPDATED');
  try {
    // let newTemplate = { ...template } /// remember to come back to this
    // delete newTemplate.templateHistory
    // template.templateHistory.push(newTemplate)

    // console.log('template', template); // dont change the database
    const copyTemplateId = template._id; //return the changes to  the store
    var id = ObjectId(template._id);
    delete template._id; //why remove the id??? check if its bad ,
    // need to remove the id but in the front we need the id
    const collection = await dbService.getCollection('template');
    await collection.updateOne({ _id: id }, { $set: { ...template } });
    // updatedTemplate._id = id;
    // console.log(template);
    template._id = copyTemplateId; //return the id work!!
    return template;
  } catch (err) {
    logger.error(`cannot update template ${template._id}`, err);
    throw err;
  }
}

async function add(template) {
  try {
    const collection = await dbService.getCollection('template');
    // console.log('23478 collection', collection);
    const addedTemplate = await collection.insertOne(template);
    console.log('addedTemplate:', addedTemplate);
    return template;
  } catch (err) {
    logger.error('cannot insert template', err);
    throw err;
  }
}

function filterTemplates(filterBy, templatesToShow) {
  if (
    Object.keys(filterBy).length === 0 ||
    !filterBy ||
    (filterBy.title === '' && filterBy.label < 1)
  ) {
    return templatesToShow;
  }
  const searchStr = filterBy.title.toLowerCase();
  templatesToShow = templatesToShow.filter((template) => {
    return template.name.toLowerCase().includes(searchStr);
  });
  const isInStock = filterBy.selectOpt === 'stock';

  templatesToShow = templatesToShow.filter(
    (template) => filterBy.selectOpt === 'All' || template.inStock === isInStock
  );

  // console.log(templatesToShow.length);
  if (!filterBy.labels) return templatesToShow;

  templatesToShow = templatesToShow.filter((template) => {
    return filterBy.labels.every((label) => template.labels.includes(label));
  });

  return templatesToShow;
}
