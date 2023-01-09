import axios from 'axios'
import { RequestType, RequestMethod } from 'domain/request'
import { API_ENDPOINT } from 'utils/constants'
import { requestTrackingWorker } from './workers'

const axiosClient = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    const sendingTime = new Date().toISOString()
    const request: RequestType = {
      endpoint: `${config.baseURL}${config?.url?.substring(1)}`,
      method: config?.method as RequestMethod,
      sendingTime,
      params: config?.method === 'get' ? config?.params : config?.data
    }
    requestTrackingWorker.postMessage(JSON.stringify(request))
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default axiosClient
