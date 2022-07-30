var models = require('../models');

module.exports = {

  getWithProductId: function (req, res) {
    const productId = req.params.product_id;
    const sort = req.query.sort;
    const count = req.query.count;
    const page = req.query.page - 1;
    models.reviews.getWithProductId(productId, sort, count, page, function(err, results) {
      if (err) {
        console.error('Unable to retrieve REVIEW from the database: ', err);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  },

  post: async function (req, res) {
    const productId = req.params.product_id;
    const body = req.body;
    try {
      await models.reviews.post(productId, body);
      res.status(201).send('Successful add new review!');
    } catch (err) {
      console.error('Unable to add REVIEW to the database: ', err);
      res.sendStatus(500);
    }
  },

  putHelpful: async function (req, res) {
    const reviewId = req.body.review_id;
    try {
      await models.reviews.putHelpful(reviewId);
      res.status(204).send('Successful add helpful to the review!');
    } catch (err) {
      console.error('Unable to UPDATE HELPFUL to the database: ', err);
      res.sendStatus(500);
    }
  },

  putReport: async function (req, res) {
    const reviewId = req.body.review_id;
    try {
      await models.reviews.putReport(reviewId);
      res.status(204).send('Successful add helpful to the review!');
    } catch (err) {
      console.error('Unable to UPDATE HELPFUL to the database: ', err);
      res.sendStatus(500);
    }
  }
};