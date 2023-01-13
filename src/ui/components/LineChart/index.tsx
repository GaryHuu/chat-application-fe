import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip)

type Props = {
  data: string[] | number[]
  titleX: string
  titleY: string
  title: string
  labels: string[]
  borderColor?: string
  backgroundColor?: string
}

function LineChart({
  data,
  titleX,
  titleY,
  title,
  labels,
  borderColor = 'rgb(53, 162, 235)',
  backgroundColor = 'rgba(53, 162, 235, 0.5)'
}: Props) {
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: titleX
        }
      },
      y: {
        title: {
          display: true,
          text: titleY
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: title
      }
    }
  }

  const dataChart = {
    labels,
    datasets: [
      {
        data,
        borderColor,
        backgroundColor
      }
    ]
  }

  return <Line options={options} data={dataChart} />
}

export default LineChart
