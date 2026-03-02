export type GameStoreName = 'highscores' | 'upgrades' | 'settings' | 'telemetry'

const DATABASE_NAME = 'space-invaders-modern-ui'
const DATABASE_VERSION = 1

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

export function openGameDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      const stores: GameStoreName[] = ['highscores', 'upgrades', 'settings', 'telemetry']

      for (const storeName of stores) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' })
        }
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function putRecord<T extends { id: string }>(
  storeName: GameStoreName,
  value: T
): Promise<void> {
  const db = await openGameDb()
  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)

  store.put(value)
  await transactionDone(transaction)
  db.close()
}

export async function getRecord<T>(storeName: GameStoreName, id: string): Promise<T | null> {
  const db = await openGameDb()
  const transaction = db.transaction(storeName, 'readonly')
  const store = transaction.objectStore(storeName)

  const result = await requestToPromise(store.get(id))
  await transactionDone(transaction)
  db.close()

  return (result as T | undefined) ?? null
}

export async function getAllRecords<T>(storeName: GameStoreName): Promise<T[]> {
  const db = await openGameDb()
  const transaction = db.transaction(storeName, 'readonly')
  const store = transaction.objectStore(storeName)

  const result = await requestToPromise(store.getAll())
  await transactionDone(transaction)
  db.close()

  return result as T[]
}

export async function deleteRecord(storeName: GameStoreName, id: string): Promise<void> {
  const db = await openGameDb()
  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)

  store.delete(id)
  await transactionDone(transaction)
  db.close()
}
