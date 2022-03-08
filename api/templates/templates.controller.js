const templateService = require('./templates-service.js');
const logger = require('../../services/logger.service');
const utilService = require('../../services/utilService.js');
const wapService = require('../wap/wap-service.js');
//add updateCmp removeCmp addCmp copyCmp, removeEl ?getEmptyTemplate

//template List
async function getTemplates(req, res) {
  try {
    console.log('????? Someone asks for Templates');
    var queryParams = req.query;
    const templates = await templateService.query(queryParams);
    console.log('GETTING TEMPLATES', templates);

    res.json(templates);
  } catch (err) {
    logger.error('Failed to get templates', err);
    res.status(500).send({ err: 'Failed to get templates' });
  }
}
// GET BY ID
async function getTemplateById(req, res) {
  console.log('Someone asks for Templates by id');

  try {
    const templateId = req.params.id;
    const template = await templateService.getById(templateId);
    res.json(template);
  } catch (err) {
    console.log(err);
    logger.error('Failed to get template', err);
    res.status(500).send({ err: 'Failed to get template' });
  }
}
// POST (add wap by template ID)
async function createNewWap(req, res) {
  try {
    const { templateId, newWapData } = req.body;
    let template;
    if (templateId) {
      template = await templateService.getById(templateId);
      template.name = newWapData.name;
      template.usersData = newWapData.users;
    } else {
      template = {
        name: 'New Project',
        imgUrl: '',
        usersData: {
          contacts: [{ email: '', msg: '', at: null }],
          signups: [{ email: '', at: null }],
        },
        cmps: [],
        wapHistory: [],
      };
    }
    const wap = await wapService.add(template, req.session.user);
    console.log('A wap has been created successfully: ', wap);
    res.json(wap);
  } catch (err) {
    logger.error('Failed to add template', err);
    res.status(500).send({ err: 'Failed to add template' });
  }
}

// POST (add template)
async function addTemplate(req, res) {
  try {
    const template = req.body;
    const addedTemplate = await templateService.add(template);
    res.json(addedTemplate);
  } catch (err) {
    logger.error('Failed to add template', err);
    res.status(500).send({ err: 'Failed to add template' });
  }
}

// PUT (Update template)
async function updateTemplate(req, res) {
  try {
    const template = req.body;
    // console.log("template to update from store",template);
    const updatedTemplate = await templateService.update(template);
    res.json(updatedTemplate);
  } catch (err) {
    logger.error('Failed to update template', err);
    res.status(500).send({ err: 'Failed to update template' });
  }
}

// DELETE (Remove template)
async function removeTemplate(req, res) {
  try {
    const templateId = req.params.id;
    const removedId = await templateService.remove(templateId);
    res.send(removedId);
  } catch (err) {
    logger.error('Failed to remove template', err);
    res.status(500).send({ err: 'Failed to remove template' });
  }
}
//*****-> keep all the logic in the front service and only pass the template to update in the backend */
//ask if need to add this logic/funcs in the template-service or its ok to use the func's that are there
//new functions to add from front service //need templateId, cmp, idx
//also add in the routes******* important
async function addCmp(req, res) {
  //check if need to add addCmp func in the template.service that do the logic and not in the controller
  try {
    const templateId = req.params.id;
    const { cmp, idx } = req.body; // data obj need to contain cmp, and idx -> from the dnd
    var template = await templateService.getById(templateId);
    template.cmps.splice(idx, 0, cmp);
    const updatedTemplate = await templateService.update(template);
    res.json(updatedTemplate);
  } catch (err) {
    logger.error('Failed to add cmp', err);
    res.status(500).send({ err: 'Failed to add cmp' });
  }
}

async function updateCmp(req, res) {
  //need templateId, newCmp
  try {
    const templateId = req.params.id;
    const newCmp = req.body; //need to send from the front service the cmp
    var template = await templateService.getById(templateId);
    const idx = template.cmps.findIndex((cmp) => cmp.id === newCmp.id);
    template.cmps.splice(idx, 1, newCmp);
    const updatedTemplate = await templateService.update(template);
    res.json(updatedTemplate);
  } catch (err) {
    logger.error('Failed to update cmp', err);
    res.status(500).send({ err: 'Failed to update cmp' });
  }
}

async function removeCmp(req, res) {
  //need templateId, cmpId
  try {
    const templateId = req.params.id;
    const cmpId = req.body; //need to send from the front service the cmpId
    var template = await templateService.getById(templateId);
    const idx = template.cmps.findIndex((cmp) => cmp.id === cmpId);
    template.cmps.splice(idx, 1);
    const updatedTemplate = await templateService.update(template);
    res.json(updatedTemplate);
  } catch (err) {
    logger.error('Failed to remove cmp', err);
    res.status(500).send({ err: 'Failed to remove cmp' });
  }
}

async function copyCmp(req, res) {
  //ask if this func need to be only in the store using the currTemplate
  //need templateId, cmpId
  try {
    const templateId = req.params.id;
    const cmpId = req.body; //need to send from the front service the cmpId
    var template = await templateService.getById(templateId);
    const cmp = template.cmps.find((cmp) => cmp.id === cmpId);
    const newCopyCmp = JSON.parse(JSON.stringify(cmp));
    newCopyCmp.id = utilService.makeId(); //change id soo it will not duplicate
    res.json(newCopyCmp); //only copy a cmp and return the copy myaby need to be in the store only
  } catch (err) {
    logger.error('Failed to remove cmp', err);
    res.status(500).send({ err: 'Failed to remove cmp' });
  }
}

module.exports = {
  getTemplates,
  getTemplateById,
  addTemplate,
  updateTemplate,
  removeTemplate,
  createNewWap,
};
