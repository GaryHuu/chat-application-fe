import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import styles from './styles'

type Props = {
  title: string
  total: string | number
  percent: number | string
}

function NumberStatisticBox({ title, total, percent }: Props) {
  const isDecrease = +percent < 0
  return (
    <Card sx={styles.wrapper}>
      <CardContent>
        <Typography sx={styles.title}>{title}</Typography>
        <Typography sx={styles.value}>{total}</Typography>
        <Box sx={styles.percentContainer}>
          {isDecrease ? (
            <>
              <ArrowDownwardIcon sx={styles.percentDecrease} />
              <Typography sx={styles.percentDecrease}>
                {percent.toString().substring(1)}%
              </Typography>
            </>
          ) : (
            <>
              <ArrowUpwardIcon sx={styles.arrowIncrease} />
              <Typography sx={styles.percentIncrease}>{percent}%</Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default NumberStatisticBox
