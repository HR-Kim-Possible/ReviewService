/* eslint-disable camelcase */
const {client} = require('../db');
const {db, pgp} = require('../db');

module.exports = {
  getWithProductId: function (productId, sort, count, page, callback) {
    let sortVal = 'length(r.body)';
    if (sort === 'helpful') {
      sortVal = 'r.helpfulness';
    } else if (sort === 'newest') {
      sortVal = 'r.create_date';
    }
    count = count || 5;
    page = page || 0;
    const text = `SELECT r.id AS review_id, r.rating, r.summary, r.recommend,
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
    ORDER BY ${sortVal} DESC LIMIT ${count} OFFSET ${page}
    `;
    const values = [productId];
    client
      .query(text, values)
      .then(res => {
        let dbReview = {'product': productId};
        dbReview.page = parseInt(page);
        dbReview.count = parseInt(count);
        dbReview.results = res.rows;
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

    const queries = [
      // Update recommend count
      {query: `INSERT INTO public.meta_review_recommend(
        product_id, recommend, recommend_count)
        VALUES (${productId}, ${recommend}, 1)
        ON CONFLICT (product_id, recommend)
        DO UPDATE SET recommend_count = public.meta_review_recommend.recommend_count + 1;`, values: []},
      // Update rating count
      {query: `INSERT INTO public.meta_review_rating(
        product_id, rating, rating_count)
        VALUES (${productId}, ${rating}, 1)
        ON CONFLICT (product_id, rating)
        DO UPDATE SET rating_count = public.meta_review_rating.rating_count + 1;`, values: []},
      // Update characteristic avg value
      {query: `
        UPDATE public.meta_review_characteristic
        SET
            ch_value=subquery.ch_value
        FROM (
            SELECT ch.id, ch.product_id, ch.name, avg(cr.value) as ch_value
            FROM characteristic as ch
            join characteristic_review as cr
            on ch.id = cr.characteristic_id
            group by ch.id, ch.product_id, ch.name
            having ch.product_id = 40348
        ) AS subquery
        WHERE
        public.meta_review_characteristic.id=subquery.id
        and
        public.meta_review_characteristic.product_id = subquery.product_id
        and
        public.meta_review_characteristic.name = subquery.name`, values: []}
    ];
    const sql = pgp.helpers.concat(queries);
    await db.multi(sql);
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