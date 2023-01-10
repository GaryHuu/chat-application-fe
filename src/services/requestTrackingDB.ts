import { RequestSchema } from 'services/DBSchema'

const OBJECT_STORE_NAME = 'User'

function requestTrackingDB() {
  let dbRef: IDBDatabase | null

  const initRequestTrackingDB = () => {
    return new Promise((resolve, reject) => {
      const dbName = 'REQUEST_TRACKING'
      const request: IDBOpenDBRequest = indexedDB.open(dbName, 1)

      request.onerror = () => {
        reject(request.error)
      }

      request.onupgradeneeded = (event: any) => {
        dbRef = event?.target?.result as IDBDatabase
        const objectStore = dbRef.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: 'sendingTime'
        })
        objectStore.createIndex('endpoint', 'endpoint', { unique: false })
        objectStore.createIndex('sendingTime', 'sendingTime', { unique: false })
        objectStore.createIndex('method', 'method', { unique: false })
      }

      request.onsuccess = async (event: any) => {
        try {
          dbRef = event?.target?.result as IDBDatabase
          resolve('Success')
        } catch (error) {
          console.error(error)
        }
      }
    })
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

  return {
    initRequestTrackingDB,
    addRequestToDB,
    getRequestsDB
  }
}

export default requestTrackingDB
