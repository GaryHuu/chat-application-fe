import axios from 'axios'
import { RequestMethod } from 'domain/request'
import { genUniqueId } from 'lib/datetime'
import { RequestSchema } from 'services/DBSchema'
import { addRequestToDB } from 'services/requestTrackingDB'
import { API_ENDPOINT } from 'utils/constants'

const axiosClient = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    const request: RequestSchema = {
      id: genUniqueId(),
      endpoint: `${config.baseURL}${config?.url?.substring(1)}`,
      method: config?.method as RequestMethod,
      sendingTime: Date.now(),
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
