/* eslint-disable no-restricted-globals */

import { getTheMostCalledEndpointMin, getTotalRequestsPerMin } from 'app/requestStatistic'
import { initDB as initRequestTrackingDB } from 'services/requestTrackingDB'
import { MAX_REQUEST_PER_MIN_WARN, START_TRACKING_WORKER_HANDLER_CODE } from 'utils/constants'

const main = () => {
  initRequestTrackingDB()

  setInterval(async () => {
    try {
      const { total } = await getTotalRequestsPerMin()
      if (total >= MAX_REQUEST_PER_MIN_WARN) {
        const value = await getTheMostCalledEndpointMin()
        const messageWarning = `${value?.method.toUpperCase()} ${value?.endpoint}`
        self.postMessage(messageWarning)
      }
    } catch (error) {
      console.error(error)
    }
  }, 60 * 1000)
}

self.onmessage = async (e: MessageEvent<string>) => {
  if (e.data === START_TRACKING_WORKER_HANDLER_CODE) {
    console.info('Worker Started')
    main()
  }
}
