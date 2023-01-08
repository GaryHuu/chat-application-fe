import { RequestType } from 'domain/request'

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
        dbRef.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: 'sendingTime'
        })
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

  const addRequestToDB = (request: RequestType) => {
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
    return new Promise<RequestType[]>((resolve, reject) => {
      if (!dbRef) {
        reject('Database not found')
        return
      }

      const request = dbRef
        .transaction(OBJECT_STORE_NAME, 'readwrite')
        .objectStore(OBJECT_STORE_NAME)
        .getAll()

      request.onsuccess = () => {
        const requests = request.result as RequestType[]
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
