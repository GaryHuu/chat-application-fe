import { MostCalledEndpointReturnType, ParamsGetRequests } from 'app/ports'
import { RequestMethod } from 'domain/request'
import { RequestSchema } from 'services/DBSchema'

const OBJECT_STORE_NAME = 'User'
let dbRef: IDBDatabase

const initDB = () => {
  const dbName = 'REQUEST_TRACKING'
  const request: IDBOpenDBRequest = indexedDB.open(dbName, 1)

  request.onerror = () => {}

  request.onupgradeneeded = (event: any) => {
    dbRef = event?.target?.result as IDBDatabase
    const objectStore = dbRef.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: 'id'
    })
    objectStore.createIndex('sendingTime', 'sendingTime', { unique: false })
  }

  request.onsuccess = async (event: any) => {
    dbRef = event?.target?.result as IDBDatabase
  }
}

const addRequestToDB = (request: RequestSchema) => {
  if (!dbRef) {
    console.error('Database not found')
    return
  }

  const transaction = dbRef.transaction(OBJECT_STORE_NAME, 'readwrite')
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
  objectStore.add(request)

  transaction.oncomplete = () => {}
  transaction.onerror = () => {}
}

const addRequestsToDB = (requestsData: RequestSchema[]) => {
  if (!dbRef) {
    console.error('Database not found')
    return
  }

  const transaction = dbRef.transaction(OBJECT_STORE_NAME, 'readwrite')
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME)

  requestsData.forEach((requestItem) => {
    const request = objectStore.add(requestItem)

    request.onsuccess = () => {}
    request.onerror = (err) => {
      console.log(request.error)
      console.error(`Error to add new request: ${err}`)
    }
  })

  transaction.oncomplete = () => {}
  transaction.onerror = () => {}
}

const getRequestsDB = () => {
  return new Promise<RequestSchema[]>((resolve, reject) => {
    if (!dbRef) {
      reject('Database not found')
      return
    }

    const request = dbRef
      .transaction(OBJECT_STORE_NAME, 'readwrite')
      .objectStore(OBJECT_STORE_NAME)
      .getAll()

    request.onsuccess = () => {
      const requests = request.result as RequestSchema[]
      if (requests.length > 0) {
        resolve(requests)
      } else {
        resolve([])
      }
    }

    request.onerror = (err) => {
      reject(`Error to get message information: ${err}`)
    }
  })
}

const getTotalRequests = (current: DateNow, type: ParamsGetRequests) => {
  return new Promise<number>((resolve, reject) => {
    if (!dbRef) {
      reject('Database not found')
      return
    }
    let prev = current

    switch (type) {
      case 'minute':
        prev = current - 1000 * 60
        break
      case 'hour':
        prev = current - 1000 * 60 * 60
        break
      case 'day':
        prev = current - 1000 * 60 * 60 * 24
        break

      default:
        break
    }

    const keyRangeValue = IDBKeyRange.bound(prev, current, true, false)
    const transaction = dbRef.transaction(OBJECT_STORE_NAME, 'readonly')
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    const index = objectStore.index('sendingTime')
    let totalRequests: number = 0
    index.openCursor(keyRangeValue).onsuccess = (event: any) => {
      const cursor = event.target.result as IDBCursorWithValue
      if (cursor) {
        totalRequests++
        cursor.continue()
      } else {
        resolve(totalRequests)
      }
    }
  })
}

const getListTotalRequestsPerMinOfHourDB = () => {
  return new Promise<number[]>((resolve, reject) => {
    if (!dbRef) {
      reject('Database not found')
      return
    }
    const now = Date.now()
    const keyRangeValue = IDBKeyRange.bound(now - 1000 * 60 * 60, now, true, false)
    const transaction = dbRef.transaction(OBJECT_STORE_NAME, 'readonly')
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    const index = objectStore.index('sendingTime')
    const requests: RequestSchema[] = []

    index.openCursor(keyRangeValue).onsuccess = (event: any) => {
      const cursor = event.target.result as IDBCursorWithValue
      if (cursor) {
        requests.push(cursor.value)
        cursor.continue()
      } else {
        const length = 60
        const total = new Array<number>(length).fill(0)
        requests.forEach((request) => {
          for (let i = 0; i < length; i++) {
            if (request.sendingTime >= now - 1000 * 60 * (i + 1)) {
              total[length - i - 1] = total[length - i - 1] + 1
              break
            }
          }
        })
        resolve(total)
      }
    }
  })
}

const getListTotalRequestsPerHourOfDayDB = () => {
  return new Promise<number[]>((resolve, reject) => {
    if (!dbRef) {
      reject('Database not found')
      return
    }
    const now = Date.now()
    const keyRangeValue = IDBKeyRange.bound(now - 1000 * 60 * 60 * 24, now, true, false)
    const transaction = dbRef.transaction(OBJECT_STORE_NAME, 'readonly')
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    const index = objectStore.index('sendingTime')
    const requests: RequestSchema[] = []

    index.openCursor(keyRangeValue).onsuccess = (event: any) => {
      const cursor = event.target.result as IDBCursorWithValue
      if (cursor) {
        requests.push(cursor.value)
        cursor.continue()
      } else {
        const length = 24
        const total = new Array<number>(length).fill(0)
        requests.forEach((request) => {
          for (let i = 0; i < length; i++) {
            if (request.sendingTime >= now - 1000 * 60 * 60 * (i + 1)) {
              total[length - i - 1] = total[length - i - 1] + 1
              break
            }
          }
        })
        resolve(total)
      }
    }
  })
}

const getTheMostCalledEndpointDB = (current: DateNow, type: ParamsGetRequests) => {
  return new Promise<MostCalledEndpointReturnType | null>((resolve, reject) => {
    if (!dbRef) {
      reject('Database not found')
      return
    }

    let prev = current
    switch (type) {
      case 'minute':
        prev = current - 1000 * 60
        break
      case 'hour':
        prev = current - 1000 * 60 * 60
        break
      case 'day':
        prev = current - 1000 * 60 * 60 * 24
        break

      default:
        break
    }

    const keyRangeValue = IDBKeyRange.bound(prev, current, true, false)
    const transaction = dbRef.transaction(OBJECT_STORE_NAME, 'readonly')
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    const index = objectStore.index('sendingTime')
    const map: any = {}
    const requests: RequestSchema[] = []
    index.openCursor(keyRangeValue).onsuccess = (event: any) => {
      const cursor = event.target.result as IDBCursorWithValue
      if (cursor) {
        const value = cursor.value as RequestSchema
        requests.push(value)
        if (map[value.endpoint]) {
          map[value.endpoint] = map[value.endpoint] + 1
        } else {
          map[value.endpoint] = 1
        }
        cursor.continue()
      } else {
        const values = Object.values(map) as number[]
        if (values.length === 0) {
          resolve(null)
        }

        let max = values[0]
        values.forEach((value) => {
          if (value > max) {
            max = value
          }
        })

        const keys = Object.keys(map) as string[]
        for (const key of keys) {
          if (map[key] === max) {
            const method = requests.find((request) => request.endpoint === key)?.method

            resolve({
              method: method as RequestMethod,
              endpoint: key
            })
          }
        }

        resolve(null)
      }
    }
  })
}

export {
  initDB,
  getRequestsDB,
  addRequestToDB,
  addRequestsToDB,
  getTotalRequests,
  getListTotalRequestsPerMinOfHourDB,
  getListTotalRequestsPerHourOfDayDB,
  getTheMostCalledEndpointDB
}
