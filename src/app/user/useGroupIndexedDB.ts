import { GroupOfUserType } from 'domain/user'
import { useRef, useState, useCallback, useEffect } from 'react'
import { USER_GROUPS_DB_NAME } from 'utils/constant'

const GROUP_OBJECT_STORE_NAME = 'groups'

type ReturnType = {
  groups: [] | GroupOfUserType[]
  addGroup: (group: GroupOfUserType) => void
  addGroups: (groups: Array<GroupOfUserType>) => void
  getGroup: (key: string) => Promise<GroupOfUserType>
  removeGroup: (key: string) => void
  clearGroups: () => void
  updateGroup: (
    key: string,
    newGroup: Partial<Omit<GroupOfUserType, 'id' | 'conversationId'>>
  ) => Promise<GroupOfUserType>
}

function useGroupIndexedDB(): ReturnType {
  const dbRef = useRef<IDBDatabase>()
  const [groups, setGroups] = useState<Array<GroupOfUserType> | []>([])

  const addGroup = useCallback((group: GroupOfUserType) => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }

    const objectStore = dbRef.current
      .transaction(GROUP_OBJECT_STORE_NAME, 'readwrite')
      .objectStore(GROUP_OBJECT_STORE_NAME)

    const request = objectStore.add(group)

    request.onsuccess = () => {
      setGroups((prev) => [...prev, group])
    }

    request.onerror = (err) => {
      console.error(`Error to add new friend: ${err}`)
    }
  }, [])

  const addGroups = useCallback((groups: Array<GroupOfUserType>) => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }

    const transaction = dbRef.current.transaction(
      GROUP_OBJECT_STORE_NAME,
      'readwrite'
    )

    const objectStore = transaction.objectStore(GROUP_OBJECT_STORE_NAME)

    groups.forEach((group) => {
      const request = objectStore.add(group)

      request.onsuccess = () => {}

      request.onerror = (err) => {
        console.error(`Error to add new group: ${err}`)
      }
    })

    transaction.oncomplete = () => {
      setGroups((prev) => [...prev, ...groups])
    }
  }, [])

  const getGroup = useCallback((key: string) => {
    return new Promise<GroupOfUserType>((resolve, reject) => {
      if (!dbRef.current) {
        reject('Database not found')
        return
      }

      const request = dbRef.current
        .transaction(GROUP_OBJECT_STORE_NAME, 'readwrite')
        .objectStore(GROUP_OBJECT_STORE_NAME)
        .get(key)

      request.onsuccess = () => {
        const group = request.result as GroupOfUserType
        resolve(group)
      }

      request.onerror = (err) => {
        reject(`Error to get group information: ${err}`)
      }
    })
  }, [])

  const getAllGroups = useCallback(() => {
    return new Promise<Array<GroupOfUserType>>((resolve, reject) => {
      if (!dbRef.current) {
        reject('Database not found')
        return
      }

      const request = dbRef.current
        .transaction(GROUP_OBJECT_STORE_NAME, 'readwrite')
        .objectStore(GROUP_OBJECT_STORE_NAME)
        .getAll()

      request.onsuccess = () => {
        const groups = request.result as Array<GroupOfUserType>
        resolve(groups)
      }

      request.onerror = (err) => {
        reject(`Error to get group information: ${err}`)
      }
    })
  }, [])

  const removeGroup = useCallback((key: string) => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }
    const request = dbRef.current
      .transaction(GROUP_OBJECT_STORE_NAME, 'readwrite')
      .objectStore(GROUP_OBJECT_STORE_NAME)
      .delete(key)

    request.onsuccess = () => {
      setGroups((prev) => {
        return prev.filter((group) => group.id === key)
      })
    }

    request.onerror = (err) => {
      console.error(`Error to delete group: ${err}`)
    }
  }, [])

  const clearGroups = useCallback(() => {
    if (!dbRef.current) {
      console.error('Database not found')
      return
    }
    const request = dbRef.current
      .transaction(GROUP_OBJECT_STORE_NAME, 'readwrite')
      .objectStore(GROUP_OBJECT_STORE_NAME)
      .clear()

    request.onsuccess = () => {
      setGroups([])
    }

    request.onerror = (err) => {
      console.error(`Error to clear group: ${err}`)
    }
  }, [])

  const updateGroup = useCallback(
    (
      key: string,
      newGroup: Partial<Omit<GroupOfUserType, 'id' | 'conversationId'>>
    ) => {
      return new Promise<GroupOfUserType>((resolve, reject) => {
        if (!dbRef.current) {
          reject('Database not found')
          return
        }

        const objectStore = dbRef.current
          .transaction(GROUP_OBJECT_STORE_NAME, 'readwrite')
          .objectStore(GROUP_OBJECT_STORE_NAME)

        const request = objectStore.get(key)

        request.onsuccess = () => {
          let _group = request.result as GroupOfUserType

          _group = {
            ..._group,
            ...newGroup,
          }

          const updateRequest = objectStore.put(_group)

          updateRequest.onsuccess = async () => {
            try {
              const index = groups.findIndex((group) => group.id === _group.id)

              if (index >= 0) {
                const _groups = [...groups.splice(index, 1, _group)]
                setGroups(_groups)
              } else {
                const newAllGroups = await getAllGroups()
                setGroups(newAllGroups)
              }
              resolve(_group)
            } catch (error) {
              console.error(error)
              reject(error)
            }
          }
        }
      })
    },
    [getAllGroups, groups]
  )

  const initDB = useCallback(() => {
    const dbName = USER_GROUPS_DB_NAME
    const request: IDBOpenDBRequest = indexedDB.open(dbName, 1)

    request.onerror = () => {
      console.error(request.error)
    }

    request.onupgradeneeded = (event: any) => {
      dbRef.current = event?.target?.result as IDBDatabase
      const objectStore = dbRef.current.createObjectStore(
        GROUP_OBJECT_STORE_NAME,
        {
          keyPath: 'id',
        }
      )
      objectStore.createIndex('id', 'id', { unique: true })
    }

    request.onsuccess = async (event: any) => {
      try {
        dbRef.current = event?.target?.result as IDBDatabase
        const newGroups = await getAllGroups()
        setGroups(newGroups)
      } catch (error) {
        console.error(error)
      }
    }
  }, [getAllGroups])

  useEffect(() => {
    initDB()
  }, [initDB])

  return {
    groups,
    addGroup,
    addGroups,
    getGroup,
    removeGroup,
    clearGroups,
    updateGroup,
  }
}

export default useGroupIndexedDB
