const express = require('express');
const {
  getOverView,
  getTour,
  getLoginForm,
} = require('../controllers/viewsController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverView);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;
