import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// https://k6.io/docs/examples/single-request
// A simple counter for http requests
// k6 run k6.js

export const requests = new Counter('http_reqs');

export const options = {
  stages: [
    { target: 10, duration: '30s' },
    { target: 100, duration: '30s' },
    { target: 1000, duration: '30s' }
  ],
  thresholds: {
    http_reqs: ['count < 20000'],
    'http_req_duration': ['p(95)<50'],
  },
};

export default function () {

  const res = http.get('http://localhost:6246/reviews/?product_id=40348&sort=newest&count=5&page=1');

  sleep(1);

  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
    'response body contains product id': (r) => r.body.includes('40348'),
  });
}
