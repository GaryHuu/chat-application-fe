import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography/Typography'
import { MostCalledEndpointReturnType, TotalStatistic } from 'app/ports'

import LineChart from 'ui/components/LineChart'
import NumberStatisticBox from 'ui/components/NumberStatisticBox'
import styles from './styles'

const labelsMin: string[] = []
for (let i = 60; i >= 1; i--) {
  labelsMin.push(`${i}`)
}
labelsMin.push('now')

const labelsHour: string[] = []
for (let i = 24; i >= 1; i--) {
  labelsHour.push(`${i}`)
}
labelsHour.push('now')

type Props = {
  totalRequestsMin?: TotalStatistic
  totalRequestsHour?: TotalStatistic
  totalRequestsDay?: TotalStatistic
  listTotalRequestMin?: number[]
  listTotalRequestHour?: number[]
  mostCalledEndpoint: {
    min?: MostCalledEndpointReturnType
    hour?: MostCalledEndpointReturnType
    day?: MostCalledEndpointReturnType
  }
}

function DashBoardComponent({
  totalRequestsMin,
  totalRequestsHour,
  totalRequestsDay,
  listTotalRequestMin,
  listTotalRequestHour,
  mostCalledEndpoint
}: Props) {
  const renderMostCalledEndpoint = () => {
    return Object.keys(mostCalledEndpoint).map((key) => {
      if (!mostCalledEndpoint?.[key as keyof typeof mostCalledEndpoint]) return null

      return (
        <Box key={key} sx={styles.mostCalledContainer}>
          <Typography sx={styles.bold}>{`The most called endpoint in ${key}`}</Typography>
          <Box sx={styles.mostCalledContent}>
            <Typography>
              {mostCalledEndpoint?.[
                key as keyof typeof mostCalledEndpoint
              ]?.method.toLocaleUpperCase()}
            </Typography>
            <Typography>
              {mostCalledEndpoint?.[key as keyof typeof mostCalledEndpoint]?.endpoint}
            </Typography>
          </Box>
        </Box>
      )
    })
  }

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.numberStatistic}>
        {totalRequestsMin && (
          <NumberStatisticBox title="Total requests of a minute ago" {...totalRequestsMin} />
        )}
        {totalRequestsHour && (
          <NumberStatisticBox title="Total requests of a hour ago" {...totalRequestsHour} />
        )}
        {totalRequestsDay && (
          <NumberStatisticBox title="Total requests of a day ago" {...totalRequestsDay} />
        )}
      </Box>
      <Box sx={styles.spacing}>{renderMostCalledEndpoint()}</Box>
      <Box
        sx={{
          width: '100%',
          maxHeight: '500px',
          marginTop: '10px'
        }}
      >
        <LineChart
          key="hour"
          data={listTotalRequestMin || []}
          title="Total requests chart of a hour ago "
          labels={labelsMin}
          titleX="Minutes"
          titleY="Requests"
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          maxHeight: '500px',
          marginTop: '10px'
        }}
      >
        <LineChart
          key="day"
          data={listTotalRequestHour || []}
          title="Total requests chart of a day ago "
          labels={labelsHour}
          titleX="Hours"
          titleY="Requests"
        />
      </Box>
    </Box>
  )
}

export default DashBoardComponent
