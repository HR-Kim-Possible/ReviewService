const {db, pgp} = require('../db');

module.exports = {
  getWithProductId: async function (productId) {
    const queries = [
      {query: 'SELECT * FROM meta_review_characteristic WHERE product_id = $1', values: [productId]},
      {query: 'SELECT * FROM meta_review_rating WHERE product_id = $1', values: [productId]},
      {query: 'SELECT * FROM meta_review_recommend WHERE product_id = $1', values: [productId]}
    ];
    const sql = pgp.helpers.concat(queries);
    const [characteristic, rating, recommend] = await db.multi(sql);
    let dbMetaReview = {};
    dbMetaReview.product_id = productId;
    dbMetaReview.ratings = {};
    dbMetaReview.recommended = {};
    dbMetaReview.characteristics = {};
    for (let i = 0; i < rating.length; i++) {
      dbMetaReview.ratings[rating[i].rating] = rating[i].rating_count;
    }
    for (let i = 0; i < recommend.length; i++) {
      dbMetaReview.recommended[recommend[i].recommend] = recommend[i].recommend_count;
    }
    for (let i = 0; i < characteristic.length; i++) {
      dbMetaReview.characteristics[characteristic[i].name] = {};
      dbMetaReview.characteristics[characteristic[i].name].id = characteristic[i].id;
      dbMetaReview.characteristics[characteristic[i].name].value = characteristic[i].ch_value;
    }
    return dbMetaReview;
  }
};