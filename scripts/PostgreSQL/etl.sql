COPY review
FROM '/review.csv'
DELIMITER ','
CSV HEADER;

COPY review_photo
FROM '/review_photo.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_review
FROM '/characteristic_review.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic
FROM '/characteristic.csv'
DELIMITER ','
CSV HEADER;