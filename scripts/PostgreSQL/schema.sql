--- step 1
DROP TABLE IF EXISTS characteristic_review;
DROP TABLE IF EXISTS review_photo;
DROP TABLE IF EXISTS characteristic;
DROP TABLE IF EXISTS meta_review_characteristic;
DROP TABLE IF EXISTS meta_review_rating;
DROP TABLE IF EXISTS meta_review_recommend;
DROP TABLE IF EXISTS review;

--- step 2
CREATE TABLE review (
 id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 product_id INTEGER NOT NULL,
 rating INTEGER NOT NULL,
 create_date bigint NOT NULL,
 summary VARCHAR(500),
 body VARCHAR(500),
 recommend VARCHAR(15) NOT NULL DEFAULT 'false',
 reported VARCHAR(15) NOT NULL DEFAULT 'false',
 reviewer_name VARCHAR(100) NOT NULL DEFAULT '',
 reviewer_email VARCHAR(100) NOT NULL DEFAULT '',
 response VARCHAR(500),
 helpfulness INTEGER NOT NULL
);

CREATE TABLE review_photo (
 id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 review_id INTEGER NOT NULL,
 url VARCHAR(500) NOT NULL
);

CREATE TABLE characteristic_review (
 id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 characteristic_id INTEGER NOT NULL,
 review_id INTEGER NOT NULL,
 value DECIMAL NOT NULL
);

CREATE TABLE characteristic (
 id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 product_id INTEGER NOT NULL,
 name VARCHAR(20) NOT NULL
);

--- step 4: before this, go to etl.sql, there is step 3 !!!
CREATE TABLE meta_review_rating AS
SELECT product_id, rating, count(*) as rating_count FROM public.review
group by product_id, rating;

CREATE TABLE meta_review_recommend AS
SELECT product_id, recommend, count(*) as recommend_count from public.review
group by product_id, recommend;

CREATE TABLE meta_review_characteristic AS
SELECT ch.id, ch.product_id, ch.name, avg(cr.value) as ch_value FROM characteristic as ch
join characteristic_review as cr
on ch.id = cr.characteristic_id
group by ch.id, ch.product_id, ch.name

--- step 5
ALTER TABLE review_photo ADD CONSTRAINT review_photo_review_id_fkey FOREIGN KEY (review_id) REFERENCES review(id);
ALTER TABLE characteristic_review ADD CONSTRAINT characteristic_review_characteristic_id_fkey FOREIGN KEY (characteristic_id) REFERENCES characteristic(id);
ALTER TABLE characteristic_review ADD CONSTRAINT characteristic_review_review_id_fkey FOREIGN KEY (review_id) REFERENCES review(id);

ALTER TABLE review
ALTER COLUMN create_date TYPE timestamp with time zone
USING TO_TIMESTAMP(create_date / 1000) AT TIME ZONE 'Z';

--- step 6
CREATE INDEX product_id_index ON review (product_id);
CREATE INDEX review_id_index ON review_photo (review_id);
CREATE INDEX meta_review_characteristic_product_id_index ON meta_review_characteristic (product_id);
CREATE INDEX meta_review_rating_product_id_index ON meta_review_rating (product_id);
CREATE INDEX meta_review_recommend_product_id_index ON meta_review_recommend (product_id);
ALTER TABLE public.meta_review_recommend
ADD CONSTRAINT index_unique_meta_review_recommend UNIQUE (product_id, recommend);
ALTER TABLE public.meta_review_rating
ADD CONSTRAINT index_unique_meta_review_rating UNIQUE (product_id, rating);
ALTER TABLE public.meta_review_characteristic
ADD CONSTRAINT index_unique_meta_review_characteristic UNIQUE (id, product_id);
CREATE INDEX characteristic_product_id_index ON characteristic (product_id);
CREATE INDEX characteristic_review_characteristic_id_index ON characteristic_review (characteristic_id);
SELECT setval('review_id_seq', max(id)) FROM public.review;
SELECT setval('characteristic_review_id_seq', max(id)) FROM public.characteristic_review;
SELECT setval('review_photo_id_seq', max(id)) FROM public.review_photo;







