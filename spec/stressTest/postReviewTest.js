import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// https://k6.io/docs/examples/single-request
// A simple counter for http requests
// cd into current dir, then k6 run postReviewTest.js

export const requests = new Counter('http_reqs');

export const options = {
  stages: [
    { target: 50, duration: '20s' },
    // { target: 50, duration: '20s' },
    // { target: 500, duration: '20s' }
  ],
  thresholds: {
    'http_req_duration': ['p(95)<50'],
  },
};

export default function () {
  const payload = JSON.stringify({
    'product_id': 40348,
    'rating': 5,
    'summary': 'summary',
    'body': 'body',
    'recommend': true,
    'name': 'Nickname',
    'email': 'Email@ee.com',
    'photos': [
      'http://res.cloudinary.com/dxhzukgow/image/upload/v1659130059/rv6os77efgt5n31okbs51.png'
    ],
    'characteristics': { '135001': 5, '135002': 5, '135003': 5, '135004': 5 }
  });
  const res = http.post('http://localhost:6246/reviews', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  sleep(1);
  const checkRes = check(res, {
    'status is 201': (r) => r.status === 201
  });
}
