const {client} = require('../db');

module.exports = {
  getWithProductId: function (productId, callback) {
    const text = `SELECT r.id AS review_id, r.rating, r.summary,r.recommend,
    r.response, r.body, r.create_date, r.reviewer_name, r.helpfulness,
    COALESCE(json_agg(rp) FILTER (WHERE rp.id IS NOT NULL), '[]')AS photos
    FROM
    (SELECT * FROM review WHERE product_id = $1) as r
    LEFT JOIN
    (SELECT review_id as id, url FROM public.review_photo
    WHERE review_id in (SELECT id FROM public.review
    WHERE product_id = $1)) AS rp
    on r.id = rp.id
    GROUP BY
    r.id,
    r.product_id,
    r.rating,
    r.create_date,
    r.summary,
    r.body,
    r.recommend,
    r.reported,
    r.reviewer_name,
    r.reviewer_email,
    r.response,
    r.helpfulness
    `;
    const values = [productId];
    client
      .query(text, values)
      .then(res => {
        let dbReview = {'product': productId};
        dbReview.results = res.rows;
        // let rawData = res.rows;
        // console.log(rawData);
        callback(null, dbReview);
      })
      .catch(e => callback(e, null));
  }
};