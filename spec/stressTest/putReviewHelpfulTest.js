import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// https://k6.io/docs/examples/single-request
// A simple counter for http requests
// k6 run k6.js

export const requests = new Counter('http_reqs');

export const options = {
  stages: [
    { target: 10, duration: '20s' },
    { target: 50, duration: '20s' },
    // { target: 500, duration: '20s' }
  ],
  thresholds: {
    'http_req_duration': ['p(95)<50'],
  },
};

export default function () {
  const res = http.put('http://localhost:6246/reviews/5774953/helpful');
  sleep(1);
  const checkRes = check(res, {
    'status is 204': (r) => r.status === 204
  });
}
