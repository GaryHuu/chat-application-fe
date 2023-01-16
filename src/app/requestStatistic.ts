import {
  getListTotalRequestsPerHourOfDayDB,
  getListTotalRequestsPerMinOfHourDB,
  getTheMostCalledEndpointDB,
  getTotalRequests
} from 'services/requestTrackingDB'
import { calculatePercent } from 'utils/helpers/function'
import { TotalStatistic } from './ports'

export const getTotalRequestsPerMin = async (): Promise<TotalStatistic> => {
  const now = Date.now()
  const prevMin = now - 60 * 1000
  const [totalRequestPerMin, totalRequestPerPrevMin] = await Promise.all([
    getTotalRequests(now, 'minute'),
    getTotalRequests(prevMin, 'minute')
  ])

  const percent = calculatePercent(totalRequestPerPrevMin, totalRequestPerMin)

  return {
    total: totalRequestPerMin,
    percent: Math.round(percent * 100) / 100
  }
}

export const getTotalRequestsPerHour = async (): Promise<TotalStatistic> => {
  const now = Date.now()
  const prevHour = now - 60 * 1000 * 60
  const [totalRequestPerHour, totalRequestPerPrevHour] = await Promise.all([
    getTotalRequests(now, 'hour'),
    getTotalRequests(prevHour, 'hour')
  ])

  const percent = calculatePercent(totalRequestPerPrevHour, totalRequestPerHour)

  return {
    total: totalRequestPerHour,
    percent: Math.round(percent * 100) / 100
  }
}

export const getTotalRequestsPerDay = async (): Promise<TotalStatistic> => {
  const now = Date.now()
  const prevDay = now - 60 * 1000 * 60 * 24
  const [totalRequestPerDay, totalRequestPerPrevDay] = await Promise.all([
    getTotalRequests(now, 'day'),
    getTotalRequests(prevDay, 'day')
  ])

  const percent = calculatePercent(totalRequestPerPrevDay, totalRequestPerDay)

  return {
    total: totalRequestPerDay,
    percent: Math.round(percent * 100) / 100
  }
}

export const getListTotalRequestsPerMinOfHour = async () => {
  const now = Date.now()
  const totalRequestPerHour = await getListTotalRequestsPerMinOfHourDB(now)
  return totalRequestPerHour
}

export const getListTotalRequestsPerHourOfDay = async () => {
  const now = Date.now()
  const totalRequestPerHour = await getListTotalRequestsPerHourOfDayDB(now)
  return totalRequestPerHour
}

export const getTheMostCalledEndpointMin = async () => {
  const now = Date.now()
  const value = await getTheMostCalledEndpointDB(now, 'minute')
  return value
}

export const getTheMostCalledEndpointHour = async () => {
  const now = Date.now()
  const value = await getTheMostCalledEndpointDB(now, 'hour')
  return value
}

export const getTheMostCalledEndpointDay = async () => {
  const now = Date.now()
  const value = await getTheMostCalledEndpointDB(now, 'day')
  return value
}
