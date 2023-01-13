import { MostCalledEndpointReturnType, TotalStatistic } from 'app/ports'
import {
  getListTotalRequestsPerHourOfDay,
  getListTotalRequestsPerMinOfHour,
  getTheMostCalledEndpointDay,
  getTheMostCalledEndpointHour,
  getTheMostCalledEndpointMin,
  getTotalRequestsPerDay,
  getTotalRequestsPerHour,
  getTotalRequestsPerMin
} from 'app/requestStatistic'
import { useEffect, useState, useMemo } from 'react'
import DashBoardComponent from 'ui/components/Dashboard'

function DashboardContainer() {
  const [totalRequestsMin, setTotalRequestMin] = useState<TotalStatistic>()
  const [totalRequestsHour, setTotalRequestHour] = useState<TotalStatistic>()
  const [totalRequestsDay, setTotalRequestDay] = useState<TotalStatistic>()
  const [listTotalRequestMin, setListTotalRequestMin] = useState<number[]>()
  const [listTotalRequestHour, setListTotalRequestHour] = useState<number[]>()
  const [mostCalledEndpointMin, setMostCalledEndpointMin] = useState<MostCalledEndpointReturnType>()
  const [mostCalledEndpointHour, setMostCalledEndpointHour] =
    useState<MostCalledEndpointReturnType>()
  const [mostCalledEndpointDay, setMostCalledEndpointDay] = useState<MostCalledEndpointReturnType>()

  const mostCalledEndpoint = useMemo(() => {
    return {
      min: mostCalledEndpointMin,
      hour: mostCalledEndpointHour,
      day: mostCalledEndpointDay
    }
  }, [mostCalledEndpointDay, mostCalledEndpointHour, mostCalledEndpointMin])

  const fetchTotalRequestMin = async () => {
    try {
      const value = await getTotalRequestsPerMin()
      setTotalRequestMin(value)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTotalRequestHour = async () => {
    try {
      const value = await getTotalRequestsPerHour()
      setTotalRequestHour(value)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTotalRequestDay = async () => {
    try {
      const value = await getTotalRequestsPerDay()
      setTotalRequestDay(value)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchListTotalRequestsPerMinOfHour = async () => {
    try {
      const value = await getListTotalRequestsPerMinOfHour()
      setListTotalRequestMin(value)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchListTotalRequestsPerHourOfDay = async () => {
    try {
      const value = await getListTotalRequestsPerHourOfDay()
      setListTotalRequestHour(value)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTheMostCalledEndpointMin = async () => {
    try {
      const value = await getTheMostCalledEndpointMin()
      if (value) {
        setMostCalledEndpointMin(value)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTheMostCalledEndpointHour = async () => {
    try {
      const value = await getTheMostCalledEndpointHour()
      if (value) {
        setMostCalledEndpointHour(value)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTheMostCalledEndpointDay = async () => {
    try {
      const value = await getTheMostCalledEndpointDay()
      if (value) {
        setMostCalledEndpointDay(value)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchData = async () => {
    try {
      const [
        newTotalRequestsMin,
        newTotalRequestsHour,
        newTotalRequestsDay,
        newListTotalRequestMin,
        newListTotalRequestHour,
        newMostCalledEndpointMin,
        newMostCalledEndpointHour,
        newMostCalledEndpointDay
      ] = await Promise.all([
        getTotalRequestsPerMin(),
        getTotalRequestsPerHour(),
        getTotalRequestsPerDay(),
        getListTotalRequestsPerMinOfHour(),
        getListTotalRequestsPerHourOfDay(),
        getTheMostCalledEndpointMin(),
        getTheMostCalledEndpointHour(),
        getTheMostCalledEndpointDay()
      ])

      newTotalRequestsMin && setTotalRequestMin(newTotalRequestsMin)
      newTotalRequestsHour && setTotalRequestHour(newTotalRequestsHour)
      newTotalRequestsDay && setTotalRequestDay(newTotalRequestsDay)
      newListTotalRequestMin && setListTotalRequestMin(newListTotalRequestMin)
      newListTotalRequestHour && setListTotalRequestHour(newListTotalRequestHour)
      newMostCalledEndpointMin && setMostCalledEndpointMin(newMostCalledEndpointMin)
      newMostCalledEndpointHour && setMostCalledEndpointHour(newMostCalledEndpointHour)
      newMostCalledEndpointDay && setMostCalledEndpointDay(newMostCalledEndpointDay)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const intervalMin = setInterval(() => {
      Promise.all([
        fetchTotalRequestMin(),
        fetchTheMostCalledEndpointMin(),
        fetchListTotalRequestsPerMinOfHour()
      ])
    }, 1000 * 60)

    return () => clearInterval(intervalMin)
  }, [])

  useEffect(() => {
    const intervalHour = setInterval(() => {
      Promise.all([
        fetchTotalRequestHour(),
        fetchListTotalRequestsPerHourOfDay(),
        fetchTheMostCalledEndpointHour()
      ])
    }, 1000 * 60 * 60)

    return () => clearInterval(intervalHour)
  }, [])

  useEffect(() => {
    const intervalDay = setInterval(() => {
      Promise.all([fetchTotalRequestDay(), fetchTheMostCalledEndpointDay()])
    }, 1000 * 60 * 60 * 24)

    return () => clearInterval(intervalDay)
  }, [])

  return (
    <DashBoardComponent
      totalRequestsMin={totalRequestsMin}
      totalRequestsHour={totalRequestsHour}
      totalRequestsDay={totalRequestsDay}
      listTotalRequestMin={listTotalRequestMin}
      listTotalRequestHour={listTotalRequestHour}
      mostCalledEndpoint={mostCalledEndpoint}
    />
  )
}

export default DashboardContainer
