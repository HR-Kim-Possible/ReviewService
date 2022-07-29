const { join } = require('path');
const axios = require('axios');

const api = join('https://app-hrsei-api.herokuapp.com/api/fec2/', process.env.CAMPUS_CODE);

var authorize = (config = {}) => {
  const options = config;
  options.headers = config.headers || {};
  options.headers.Authorization = process.env.GITHUB_API_KEY;
  return options;
};

/**
 * Makes a get request to the API using the endpoint specified
 * @param endpoint destination in the API for the request
 * @param config [optional] additional parameters to send with the request
 * @returns A thenable promise to use
 */
module.exports.get = (endpoint, config) => {
  const url = new URL(join(api, endpoint)).href;

  const options = authorize(config);

  return axios.get(url, options);
};

module.exports.put = (endpoint, data, config) => {
  const url = new URL(join(api, endpoint)).href;

  const options = authorize(config);

  return axios.put(url, data, options)
    .catch((err) => {
      console.log(err.toJSON());
    });
};

module.exports.post = (endpoint, data, config) => {
  const url = new URL(join(api, endpoint)).href;

  const options = authorize(config);

  return axios.post(url, data, options)
    .catch((err) => {
      console.error(err.toJSON());
    });
};
