/* eslint-disable camelcase */
const { Router } = require('express');

const controllers = require('./controllers');

const routes = Router();

/**
 * PATHS
 * /a/reviews/40348
 * /a/reviews/40348/meta
 *
 * QUERY PARAMETERS (only applicable non-meta request)
 * page (default 1)
 * count (default 5)
 * sort [newest, helpful, relevant, or none]
 */
// routes.get('/reviews/:product_id/:meta(meta)?', (req, res) => {
//   const path = req.params.meta
//     ? '/reviews/meta'
//     : '/reviews';
//   req.query.product_id = req.params.product_id;

//   apiGetRequest(req, res, path);
// });
routes.get('/reviews/:product_id', controllers.reviews.getWithProductId);
routes.get('/reviews/:product_id/meta', controllers.metaReviews.getWithProductId);

/**
 * PATHS
 * /a/reviews/40348
 *
 * BODY PARAMETERS
 * rating           (int)
 * summary          (text)
 * body             (text)
 * recommend        (bool)
 * name             (text)
 * email            (text)
 * photos           ([text])
 * characteristics  (object)
 */
routes.post('/reviews/:product_id', (req, res) => {
  req.body.product_id = req.params.product_id;
  apiPostRequest(req, res, '/reviews');
});
/**
 * PATHS
 * /a/reviews/123456/helpful
 * /a/reviews/123456/report
 */
routes.put('/reviews/:review_id/:action(helpful|report)', (req, res) => {
  apiPutRequest(req, res, req.path);
});


module.exports = routes;
