const { Router } = require('express');

const controllers = require('./controllers');

const routes = Router();

routes.get('/reviews/:product_id', controllers.reviews.getWithProductId);

routes.get('/reviews/:product_id/meta', controllers.metaReviews.getWithProductId);

routes.post('/reviews/:product_id', controllers.reviews.post);

routes.put('/reviews/:review_id/helpful', controllers.reviews.putHelpful);

routes.put('/reviews/:review_id/report', controllers.reviews.putReport);


module.exports = routes;
