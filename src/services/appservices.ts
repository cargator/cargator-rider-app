import axios from 'axios';
import store from '../redux/redux';

const customAxios = axios.create({
  // baseURL: `https://cab-e-socket-service-dev-fa3ocuxbpq-el.a.run.app`,
  // baseURL: `https://ab6d-182-48-208-72.ngrok-free.app`,
  baseURL: `https://api.cargator.org`,
});

customAxios.interceptors.request.use(
  function (request) {
    // Do something before request is sent
    if (request) {
      request.headers['Authorization'] = `Bearer ${
        store.getState().loginToken
      }`;
    }
    return request;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

customAxios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response.data);
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export default customAxios;
