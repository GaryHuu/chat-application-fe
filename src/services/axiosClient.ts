import axios from 'axios'
import { RequestSchema, RequestMethod } from 'services/DBSchema'
import { API_ENDPOINT } from 'utils/constants'
import requestTrackingDB from './requestTrackingDB'

const { initRequestTrackingDB, addRequestToDB } = requestTrackingDB()
initRequestTrackingDB()

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
    const request: RequestSchema = {
      endpoint: `${config.baseURL}${config?.url?.substring(1)}`,
      method: config?.method as RequestMethod,
      sendingTime,
      params: config?.method === 'get' ? config?.params : config?.data
    }
    addRequestToDB(request)
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
