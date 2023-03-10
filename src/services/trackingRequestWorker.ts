/* eslint-disable no-restricted-globals */

import {
  getObjectTimesEndpointCalledDay,
  getObjectTimesEndpointCalledHour,
  getObjectTimesEndpointCalledMin
} from 'app/requestStatistic'
import { initDB as initRequestTrackingDB } from 'services/requestTrackingDB'
import {
  MAX_REQUEST_PER_DAY_WARN,
  MAX_REQUEST_PER_HOUR_WARN,
  MAX_REQUEST_PER_MIN_WARN,
  START_TRACKING_WORKER_HANDLER_CODE
} from 'utils/constants'

const main = () => {
  initRequestTrackingDB()

  setInterval(async () => {
    try {
      const object = await getObjectTimesEndpointCalledMin()
      if (!object) return
      const keys = Object.keys(object) as string[]
      for (const key of keys) {
        if (object[key].times >= MAX_REQUEST_PER_MIN_WARN) {
          const messageWarning = `${object[key]?.method.toUpperCase()} ${key} x${
            object[key]?.times
          } times`
          self.postMessage(messageWarning)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, 10 * 1000)

  setInterval(async () => {
    try {
      const object = await getObjectTimesEndpointCalledHour()
      if (!object) return
      const keys = Object.keys(object) as string[]
      for (const key of keys) {
        if (object[key].times >= MAX_REQUEST_PER_HOUR_WARN) {
          const messageWarning = `${object[key]?.method.toUpperCase()} ${key} x${
            object[key]?.times
          } times`
          self.postMessage(messageWarning)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, 60 * 60 * 1000)

  setInterval(async () => {
    try {
      const object = await getObjectTimesEndpointCalledDay()
      if (!object) return
      const keys = Object.keys(object) as string[]
      for (const key of keys) {
        if (object[key].times >= MAX_REQUEST_PER_DAY_WARN) {
          const messageWarning = `${object[key]?.method.toUpperCase()} ${key} x${
            object[key]?.times
          } times`
          self.postMessage(messageWarning)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, 24 * 60 * 60 * 1000)
}

self.onmessage = async (e: MessageEvent<string>) => {
  if (e.data === START_TRACKING_WORKER_HANDLER_CODE) {
    console.info('Worker Started')
    main()
  }
}
