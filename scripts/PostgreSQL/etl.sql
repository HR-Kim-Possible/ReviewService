COPY review
FROM '/Users/austin/ReviewService/tempCSV/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY review_photo
FROM '/Users/austin/ReviewService/tempCSV/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_review
FROM '/Users/austin/ReviewService/tempCSV/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic
FROM '/Users/austin/ReviewService/tempCSV/characteristics.csv'
DELIMITER ','
CSV HEADER;