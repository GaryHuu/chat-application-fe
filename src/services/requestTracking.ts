import { RequestType } from 'domain/request'
import requestTrackingDB from 'services/requestTrackingDB'

const { initRequestTrackingDB, addRequestToDB } = requestTrackingDB()
initRequestTrackingDB()

// eslint-disable-next-line no-restricted-globals
self.onmessage = (e: MessageEvent<string>) => {
  const dataEvent = JSON.parse(e.data)
  const newData: RequestType = {
    endpoint: `${dataEvent?.baseURL}${dataEvent?.url?.substring(1)}`,
    method: dataEvent?.method,
    sendingTime: dataEvent?.sendingTime,
    params: dataEvent?.method === 'get' ? dataEvent?.params : dataEvent?.data
  }
  addRequestToDB(newData)
}
