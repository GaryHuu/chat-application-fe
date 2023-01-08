import { RequestType } from 'domain/request'

// eslint-disable-next-line no-restricted-globals
self.onmessage = (e: MessageEvent<string>) => {
  const dataEvent = JSON.parse(e.data)
  const newData: RequestType = {
    endpoint: `${dataEvent?.baseURL?.substring(1)}${dataEvent?.url}`,
    method: dataEvent?.method,
    sendingTime: new Date().toISOString(),
    params: dataEvent?.method === 'get' ? dataEvent?.params : dataEvent?.data
  }

  console.log(newData)
}
