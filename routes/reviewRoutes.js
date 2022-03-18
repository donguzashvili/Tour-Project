const express = require('express');

const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
//after this noone can access this function who is not logged in
router.use(protect);

router
  .route('/')
  .post(protect, restrictTo('user'), setTourUserIds, createReview);
router.route('/').get(getAllReviews);
router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);
module.exports = router;
