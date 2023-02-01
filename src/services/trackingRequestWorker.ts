/* eslint-disable no-restricted-globals */

import { getTheMostCalledEndpointMin } from 'app/requestStatistic'
import { initDB as initRequestTrackingDB } from 'services/requestTrackingDB'
import { MAX_REQUEST_PER_MIN_WARN, START_TRACKING_WORKER_HANDLER_CODE } from 'utils/constants'

const main = () => {
  initRequestTrackingDB()

  setInterval(async () => {
    try {
      const value = await getTheMostCalledEndpointMin()
      if (!value) return
      if (value?.times >= MAX_REQUEST_PER_MIN_WARN) {
        const messageWarning = `${value?.method.toUpperCase()} ${value?.endpoint} x${value?.times} times`
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
