import { RequestType } from 'domain/request'
import requestTrackingDB from 'services/requestTrackingDB'

const { initRequestTrackingDB, addRequestToDB } = requestTrackingDB()
initRequestTrackingDB()

// eslint-disable-next-line no-restricted-globals
self.onmessage = (e: MessageEvent<string>) => {
  const dataEvent = JSON.parse(e.data) as RequestType
  addRequestToDB(dataEvent)
}
