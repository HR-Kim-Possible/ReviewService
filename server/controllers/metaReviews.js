var models = require('../models');

module.exports = {
  getWithProductId: async function (req, res) {
    const productId = req.query.product_id;
    try {
      const metareview = await models.metaReviews.getWithProductId(productId);
      res.json(metareview);
    } catch (error) {
      console.error('Unable to retrieve MATE REVIEW from the database: ', error);
      res.sendStatus(500);
    }
  }
};