import dayjs from 'dayjs'

export function currentDatetime(): DateTimeString {
  return new Date().toISOString()
}

export function formatTime(date: DateTimeString, format: string = 'h:mm A') {
  return dayjs(date).format(format)
}
