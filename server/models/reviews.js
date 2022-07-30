/* eslint-disable camelcase */
const {client} = require('../db');
const {db, pgp} = require('../db');

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
  },

  post: async function(productId, reqBody) {
    let {product_id, rating, summary, body, recommend, name, email, photos, characteristics} = reqBody;

    const res = await db.one(`SELECT setval('review_id_seq', max(id)) FROM public.review;
            INSERT INTO public.review(
            product_id, rating, create_date, summary, body, recommend, reported, reviewer_name,
            reviewer_email, response, helpfulness)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;`,
    [product_id, rating, new Date(), summary, body, recommend, 'false', name, email, 'null', 0]);

    for (const [key, value] of Object.entries(characteristics)) {
      await client.query(`INSERT INTO public.characteristic_review(
        characteristic_id, review_id, value)
        VALUES ($1, $2, $3);`, [parseInt(key), res.id, value]);
    }

    for (let i = 0; i < photos.length; i++) {
      await db.one(`SELECT setval('review_photo_id_seq', max(id)) FROM public.review_photo;
      INSERT INTO public.review_photo(
        review_id, url)
        VALUES ($1, $2) RETURNING id;`, [res.id, photos[i]]);
    }
  },

  putHelpful: async function(reviewId) {
    const text = `UPDATE public.review
    SET helpfulness=helpfulness+1
    WHERE id = $1;`;
    const values = [reviewId];
    await client.query(text, values);
  },

  putReport: async function(reviewId) {
    const text = `UPDATE public.review
    SET reported='true'
    WHERE id = $1;`;
    const values = [reviewId];
    await client.query(text, values);
  }
};