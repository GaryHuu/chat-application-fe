import { FriendOfUserType } from 'domain/user'
import { useCallback, useEffect, useRef, useState } from 'react'
import { USER_FRIEND_DB_NAME } from 'utils/constant'

const FRIEND_OBJECT_STORE_NAME = 'friends'

type ReturnType = {
  friends: [] | FriendOfUserType[]
  addFriend: (friend: FriendOfUserType) => void
  addFriends: (friends: Array<FriendOfUserType>) => void
  getFriend: (key: string) => Promise<FriendOfUserType>
  removeFriend: (key: string) => void
  clearFriends: () => void
  updateFriend: (
    key: string,
    newFriend: Partial<Omit<FriendOfUserType, 'id' | 'conversationId'>>
  ) => Promise<FriendOfUserType>
}

function useFriendIndexedDB(): ReturnType {
  const dbRef = useRef<IDBDatabase>()
  const [friends, setFriends] = useState<Array<FriendOfUserType> | []>([])

  const addFriend = useCallback((friend: FriendOfUserType) => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }

    const objectStore = dbRef.current
      .transaction(FRIEND_OBJECT_STORE_NAME, 'readwrite')
      .objectStore(FRIEND_OBJECT_STORE_NAME)

    const request = objectStore.add(friend)

    request.onsuccess = () => {
      setFriends((prev) => [...prev, friend])
    }

    request.onerror = (err) => {
      console.error(`Error to add new friend: ${err}`)
    }
  }, [])

  const addFriends = useCallback((friends: Array<FriendOfUserType>) => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }

    const transaction = dbRef.current.transaction(
      FRIEND_OBJECT_STORE_NAME,
      'readwrite'
    )

    const objectStore = transaction.objectStore(FRIEND_OBJECT_STORE_NAME)

    friends.forEach((friend) => {
      const request = objectStore.add(friend)

      request.onsuccess = () => {}

      request.onerror = (err) => {
        console.error(`Error to add new friend: ${err}`)
      }
    })

    transaction.oncomplete = () => {
      setFriends((prev) => [...prev, ...friends])
    }
  }, [])

  const getFriend = useCallback((key: string) => {
    return new Promise<FriendOfUserType>((resolve, reject) => {
      if (!dbRef.current) {
        reject('Database not found')
        return
      }

      const request = dbRef.current
        .transaction(FRIEND_OBJECT_STORE_NAME, 'readwrite')
        .objectStore(FRIEND_OBJECT_STORE_NAME)
        .get(key)

      request.onsuccess = () => {
        const friend = request.result as FriendOfUserType
        resolve(friend)
      }

      request.onerror = (err) => {
        reject(`Error to get friend information: ${err}`)
      }
    })
  }, [])

  const getAllFriends = useCallback(() => {
    return new Promise<Array<FriendOfUserType>>((resolve, reject) => {
      if (!dbRef.current) {
        reject('Database not found')
        return
      }

      const request = dbRef.current
        .transaction(FRIEND_OBJECT_STORE_NAME, 'readwrite')
        .objectStore(FRIEND_OBJECT_STORE_NAME)
        .getAll()

      request.onsuccess = () => {
        const friends = request.result as Array<FriendOfUserType>
        resolve(friends)
      }

      request.onerror = (err) => {
        reject(`Error to get friend information: ${err}`)
      }
    })
  }, [])

  const removeFriend = useCallback((key: string) => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }
    const request = dbRef.current
      .transaction(FRIEND_OBJECT_STORE_NAME, 'readwrite')
      .objectStore(FRIEND_OBJECT_STORE_NAME)
      .delete(key)

    request.onsuccess = () => {
      setFriends((prev) => {
        return prev.filter((friend) => friend.id === key)
      })
    }

    request.onerror = (err) => {
      console.error(`Error to delete friend: ${err}`)
    }
  }, [])

  const clearFriends = useCallback(() => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }
    const request = dbRef.current
      .transaction(FRIEND_OBJECT_STORE_NAME, 'readwrite')
      .objectStore(FRIEND_OBJECT_STORE_NAME)
      .clear()

    request.onsuccess = () => {
      setFriends([])
    }

    request.onerror = (err) => {
      console.error(`Error to clear friend: ${err}`)
    }
  }, [])

  const updateFriend = useCallback(
    (
      key: string,
      newFriend: Partial<Omit<FriendOfUserType, 'id' | 'conversationId'>>
    ) => {
      return new Promise<FriendOfUserType>((resolve, reject) => {
        if (!dbRef.current) {
          reject('Database not found')
          return
        }

        const objectStore = dbRef.current
          .transaction(FRIEND_OBJECT_STORE_NAME, 'readwrite')
          .objectStore(FRIEND_OBJECT_STORE_NAME)

        const request = objectStore.get(key)

        request.onsuccess = () => {
          let _friend = request.result as FriendOfUserType

          _friend = {
            ..._friend,
            ...newFriend,
          }

          const updateRequest = objectStore.put(_friend)

          updateRequest.onsuccess = async () => {
            try {
              const index = friends.findIndex(
                (friend) => friend.id === _friend.id
              )

              if (index >= 0) {
                const _friends = [...friends.splice(index, 1, _friend)]
                setFriends(_friends)
              } else {
                const newAllFriends = await getAllFriends()
                setFriends(newAllFriends)
              }
              resolve(_friend)
            } catch (error) {
              console.error(error)
              reject(error)
            }
          }
        }
      })
    },
    [friends, getAllFriends]
  )

  const initDB = useCallback(() => {
    const dbName = USER_FRIEND_DB_NAME
    const request: IDBOpenDBRequest = indexedDB.open(dbName, 1)

    request.onerror = () => {
      console.error(request.error)
    }

    request.onupgradeneeded = (event: any) => {
      dbRef.current = event?.target?.result as IDBDatabase
      const objectStore = dbRef.current.createObjectStore(
        FRIEND_OBJECT_STORE_NAME,
        {
          keyPath: 'id',
        }
      )
      objectStore.createIndex('id', 'id', { unique: true })
    }

    request.onsuccess = async (event: any) => {
      try {
        dbRef.current = event?.target?.result as IDBDatabase
        const newFriends = await getAllFriends()
        setFriends(newFriends)
      } catch (error) {
        console.error(error)
      }
    }
  }, [getAllFriends])

  useEffect(() => {
    initDB()
  }, [initDB])

  return {
    friends,
    addFriend,
    addFriends,
    getFriend,
    removeFriend,
    clearFriends,
    updateFriend,
  }
}

export default useFriendIndexedDB
