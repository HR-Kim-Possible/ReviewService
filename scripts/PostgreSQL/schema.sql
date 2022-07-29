DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS review_photo;
DROP TABLE IF EXISTS meta_review;
DROP TABLE IF EXISTS characteristic_review;
DROP TABLE IF EXISTS characteristic;

CREATE TABLE review (
 id INTEGER PRIMARY KEY,
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
 id INTEGER PRIMARY KEY,
 review_id INTEGER NOT NULL,
 url VARCHAR(500) NOT NULL
);

ALTER TABLE review_photo ADD CONSTRAINT review_photo_review_id_fkey FOREIGN KEY (review_id) REFERENCES review(id);


CREATE TABLE meta_review (
 id INTEGER PRIMARY KEY,
 product_id INTEGER NOT NULL,
 ratings INTEGER NOT NULL,
 recommended VARCHAR(150) NOT NULL
);


CREATE TABLE characteristic_review (
 id INTEGER PRIMARY KEY,
 characteristic_id INTEGER NOT NULL,
 review_id INTEGER NOT NULL,
 value DECIMAL NOT NULL
);

ALTER TABLE characteristic_review ADD CONSTRAINT characteristic_review_characteristic_id_fkey FOREIGN KEY (characteristic_id) REFERENCES characteristic(id);
ALTER TABLE characteristic_review ADD CONSTRAINT characteristic_review_review_id_fkey FOREIGN KEY (review_id) REFERENCES review(id);

CREATE TABLE characteristic (
 id INTEGER PRIMARY KEY,
 product_id INTEGER NOT NULL,
 name VARCHAR(20) NOT NULL
);

CREATE VIEW meta_review_rating AS
SELECT product_id, rating, count(*) as rating_count FROM public.review
group by product_id, rating;

CREATE VIEW meta_review_recommend AS
SELECT product_id, recommend, count(*) as recommend_count from public.review
group by product_id, recommend;

CREATE VIEW meta_review_characteristic AS
SELECT ch.id, ch.product_id, ch.name, avg(cr.value) as ch_value FROM characteristic as ch
join characteristic_review as cr
on ch.id = cr.characteristic_id
group by ch.id, ch.product_id, ch.name

