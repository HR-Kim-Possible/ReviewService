var models = require('../models');

module.exports = {

  getWithProductId: function (req, res) {
    const productId = req.params.product_id;
    models.reviews.getWithProductId(productId, function(err, results) {
      if (err) {
        console.error('Unable to retrieve REVIEW from the database: ', err);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  }
};