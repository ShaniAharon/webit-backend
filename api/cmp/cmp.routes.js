const express = require('express');
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware');
const {
  getCmps,
  getCmpById,
  addCmp,
  updateCmp,
  removeCmp,
  addReview,
} = require('./cmp.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getCmps);
router.get('/:id', getCmpById);
router.post('/', requireAuth, requireAdmin, addCmp);
router.put('/:id', requireAuth, requireAdmin, updateCmp);
router.delete('/:id', requireAuth, requireAdmin, removeCmp);
router.post('/:id/review', addReview); //need to change it work with reviews service

module.exports = router;
