const { Router } = require('express');

const controllers = require('./controllers');

const routes = Router();

routes.get('/reviews/', controllers.reviews.getWithProductId);

routes.get('/reviews/meta', controllers.metaReviews.getWithProductId);

routes.post('/reviews/', controllers.reviews.post);

routes.put('/reviews/:review_id/helpful', controllers.reviews.putHelpful);

routes.put('/reviews/:review_id/report', controllers.reviews.putReport);


module.exports = routes;
